#!/usr/bin/env python

from threading import Thread, Event, Timer
from Queue import Queue
import time
import sys
import datetime
import json
import math

# Special libraries
from serial import Serial
from grovepi import *
from grove_rgb_lcd import *
import requests

# Local dependencies
from deskTimer import DeskTimer
from debounce import debounce

SANITY_API_BASE = "https://k06fkcmv.api.sanity.io/v1/data/"
SANITY_API_KEY_FILE = 'sanity'

# Seconds in each position before automatically changing
# ref: http://www.medicaldaily.com/try-sit-stand-formula-every-30-minutes-avoid-health-consequences-sitting-all-day-355250
UPPER = "heightStanding"
LOWER = "heightSitting"
POSITION_TIME = {
    UPPER: 480, # 8 min
    LOWER: 1200 # 20 min
}
DEBOUNCE = 1

# Queues
card_event_queue = Queue(maxsize=0)
tc_event_queue = Queue(maxsize=0)
screen_event_queue = Queue(maxsize=0)
temp_hum_event_queue = Queue(maxsize=0)

# Timer
deskTimer = DeskTimer()

# Buzzer
busser_pin = 2
pinMode(busser_pin, "OUTPUT")

# Button
button = 4
pinMode(button, "INPUT")

def buzz():
    digitalWrite(busser_pin, 1)
    time.sleep(0.1)
    digitalWrite(busser_pin, 0)

class DeskState(object):
    logged_in = False
    logged_in_timestamp = None
    sanity_data = {}
    position = None

    def toggle_position(self):
        if self.position == LOWER:
            self.position = UPPER
        else:
            self.position = LOWER

    @debounce(DEBOUNCE)
    def update_position(self):
        print("UPDATE POSITION")
        deskTimer.stop()
        self.toggle_position()
        tc_event_queue.put(self.sanity_data.get('tablePreferences').get(self.position))
        deskTimer.start(POSITION_TIME[self.position], self.update_position)

    def log_in(self, sanity_data):
        buzz()
        self.sanity_data = sanity_data
        print(self.sanity_data)
        self.logged_in = True
        self.logged_in_timestamp = datetime.datetime.now()
        print(sanity_data.get('id') + ' logged in')
        self.update_position()

    def log_out(self):
        buzz()
        self.logged_in = False
        self.logged_in_timestamp = None
        print(self.sanity_data.get('id') + ' logged out')
        self.sanity_data = None

def read_api_key():
    try:
        with open(SANITY_API_KEY_FILE, 'r') as f:
            return f.readline().strip('\n')
    except:
        print('Could not read sanity API key')
        sys.exit(0)

SANITY_API_KEY = read_api_key()

def make_auth_header():
    return {'Authorization': 'Bearer ' + SANITY_API_KEY}

def make_get(query):
    return requests.get(
        SANITY_API_BASE + "query/production/",
        params={'query': query},
        headers=make_auth_header()
    )

def make_post(body):
    return requests.post(
        SANITY_API_BASE + "mutate/production/?returnIds=false&returnDocuments=true&visibility=sync",
        json=body,
        headers=make_auth_header()
    )

def event_received(card_id, state):
    if not state.logged_in:
        query = "*[_type == 'person' && id == '{}']".format(card_id)
        response = make_get(query)
        if response.status_code != 200 or len(response.json().get('result')) == 0:
            print('No data for card' + card_id)
            return
        query_result = response.json().get('result')[0]
        if query_result is not None:
            setRGB(108, 180, 110)
            screen_event_queue.put(('Hello ' + query_result.get('name') + '! :)', 3))
            state.log_in(query_result)
            temp_hum_event_queue.put(state)
    else:
        deskTimer.stop()
        from_timestamp = state.logged_in_timestamp
        to_timestamp =  datetime.datetime.now()
        try:
            state.sanity_data.get('hours')
            body = {
                "mutations": [
                    {
                        "patch": {
                            "query": "*[_type == 'person' && id == '{}']".format(card_id),
                            "insert" : {
                                "after": "hours[-1]",
                                "items": [{
                                    "_type": "timeRange",
                                    "from": from_timestamp.isoformat(),
                                    "to": to_timestamp.isoformat()
                                }]
                            }
                        }
                    }
                ]
            }
            print(make_post(body))
        except KeyError:
            body = {
                "mutations": [
                    {
                        "patch": {
                            "query": "*[_type == 'person' && id == '{}']".format(card_id),
                            "setIfMissing": {
                                "hours": [{
                                    "_type": "timeRange",
                                    "from": from_timestamp.isoformat(),
                                    "to": to_timestamp.isoformat()
                                }]
                            }
                        }
                    }
                ]
            }
            print(make_post(body))
        screen_event_queue.put(('Goodbye! :)', 3))
        state.log_out()
        temp_hum_event_queue.put(state)


class RFIDReader(Thread):
    def __init__(self, queue):
        super(RFIDReader, self).__init__()
        self.queue = queue
        self.conn = Serial('/dev/ttyUSB2', 9600, 8, 'N', 1, timeout=1)
        self.shutdown_flag = Event()

    def run(self):
        while not self.shutdown_flag.is_set():
            data = self.conn.readline().strip()
            if data != '':
                self.queue.put(data)

class TableControllerWriter(Thread):
    def __init__(self, queue):
        super(TableControllerWriter, self).__init__()
        self.queue = queue
        self.conn = Serial('/dev/ttyUSB1', 9600, 8, 'N', 1, timeout=1)
        self.shutdown_flag = Event()

    def run(self):
        while not self.shutdown_flag.is_set():
            if not self.queue.empty():
                data = str(self.queue.get())
                if data[-1] != '\n':
                    data = data + '\n'
                print('writing to tablecontroller ' + data)
                self.conn.write(data)

class ScreenWriter(Thread):
    def __init__(self, queue):
        super(ScreenWriter, self).__init__()
        self.queue = queue
        self.shutdown_flag = Event()

    def run(self):
        while not self.shutdown_flag.is_set():
            if not self.queue.empty():
                try:
                    item = self.queue.get()
                    text = str(item[0])
                    print('Displaying ' + text)
                    setText(text)
                    time.sleep(item[1])
                except IOError as e:
                    print "Error writing to screen"


class TemperatureHumidityMeasurer(Thread):
    def __init__(self, queue, state):
        super(TemperatureHumidityMeasurer, self).__init__()
        self.shutdown_flag = Event()
        self.queue = queue
        self.state = state

    def run(self):
        dht_sensor_port = 7
        prev_temp, prev_hum = -1, -1
        fan_port = 3
        pinMode(fan_port, "OUPUT")
        while not self.shutdown_flag.is_set():
            try:
                if not temp_hum_event_queue.empty():
                    self.state = self.queue.get()

                [temp, hum] = dht(dht_sensor_port, 0)

                pref_temp = None
                data = self.state.sanity_data
                if data is not None:
                    pref_temp = data.get("tempPreferences")

                if pref_temp is None or temp < pref_temp:
                    digitalWrite(fan_port, 0)
                if pref_temp is not None and temp > pref_temp:
                    digitalWrite(fan_port, 1)

                if not (math.isnan(temp) or math.isnan(hum)):
                    if (temp > 0 and hum > 0):
                        if (temp != prev_temp or hum != prev_hum):
                            text = "Temp: " + str(temp) + " C      Humidity: " + str(hum) + "%"
                            screen_event_queue.put((text, 1))
                prev_temp, prev_hum = temp, hum
            except (IOError, TypeError) as e:
                print "Error reading temperature and humidity"
            time.sleep(1)

def main():
    state = DeskState()
    try:
        reader = RFIDReader(card_event_queue)
        tc_writer = TableControllerWriter(tc_event_queue)
        screen_writer = ScreenWriter(screen_event_queue)
        temp_hum = TemperatureHumidityMeasurer(temp_hum_event_queue, state)
        reader.start()
        tc_writer.start()
        screen_writer.start()
        temp_hum.start()
        while True:
            if not card_event_queue.empty():
                event_received(card_event_queue.get(), state)
            if state.logged_in and digitalRead(button):
                state.update_position()
    except (KeyboardInterrupt, SystemExit):
        reader.shutdown_flag.set()
        tc_writer.shutdown_flag.set()
        screen_writer.shutdown_flag.set()
        temp_hum.shutdown_flag.set()
        reader.join()
        tc_writer.join()
        screen_writer.join()
        temp_hum.join()
        print('\n Shutting down')

main()
