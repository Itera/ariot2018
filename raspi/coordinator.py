#!/usr/bin/env python

from threading import Thread, Event
from serial import Serial
from Queue import Queue
import time
import sys
import requests
import datetime
import json

SANITY_API_BASE = "https://k06fkcmv.api.sanity.io/v1/data/"
SANITY_API_KEY_FILE = 'sanity'

card_event_queue = Queue(maxsize=0)
tc_event_queue = Queue(maxsize=0)

class DeskState(object):
    logged_in = False
    logged_in_timestamp = None
    sanity_data = {}

    def log_in(self, sanity_data):
        self.sanity_data = sanity_data
        print(self.sanity_data)
        self.logged_in = True
        self.logged_in_timestamp = datetime.datetime.now()
        print(sanity_data.get('id') + ' logged in')
        
    def log_out(self):
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
            print('No data for card')
            return
        query_result = response.json().get('result')[0]
        if query_result is not None:
            state.log_in(query_result)
            tc_event_queue.put(query_result.get('tablePreferences').get('heightSitting'))
    else:
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
                                    "from": from_timestamp.isoformat(),
                                    "to": to_timestamp.isoformat()
                                }]
                            }
                        }
                    }
                ]
            }
            make_post(body))
        except KeyError:
            body = {
                "mutations": [
                    {
                        "patch": {
                            "query": "*[_type == 'person' && id == '{}']".format(card_id),
                            "setIfMissing": {
                                "hours": [{
                                    "from": from_timestamp.isoformat(),
                                    "to": to_timestamp.isoformat()
                                }]
                            }
                        }
                    }
                ]
            }
            make_post(body)
        state.log_out()

class RFIDReader(Thread):
    def __init__(self, queue):
        super(RFIDReader, self).__init__()
        self.queue = queue
        self.conn = Serial('/dev/ttyUSB0', 9600, 8, 'N', 1, timeout=1)
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

def main():
    state = DeskState()
    try:
        reader = RFIDReader(card_event_queue)
        tc_writer = TableControllerWriter(tc_event_queue)
        reader.start()
        tc_writer.start()
        while True:
            if not card_event_queue.empty():
                event_received(card_event_queue.get(), state)
    except (KeyboardInterrupt, SystemExit, Exception):
        reader.shutdown_flag.set()
        tc_writer.shutdown_flag.set()
        reader.join()
        tc_writer.join()
        print('\n Shutting down')


main()
