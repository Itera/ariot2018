#!/usr/bin/env python

from threading import Thread, Event
from serial import Serial
import time
import sys
import requests

SANITY_API_BASE = "https://k06fkcmv.api.sanity.io/v1/data/"
SANITY_API_KEY_FILE = 'sanity'

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
    return requests.get(SANITY_API_BASE + "query/production/?query=" + query, headers=make_auth_header())

def make_post(body):
    return requests.post(SANITY_API_BASE + "mutate/production/?returnIds=false&returnDocuments=true&visibility=sync", data=body)

def event_received(event_data):
    print(make_get('production', "*[_type == 'person']").json())

class RFIDReader(Thread):
    def __init__(self):
        super(RFIDReader, self).__init__()
        self.conn = Serial('/dev/ttyUSB0', 9600, 8, 'N', 1, timeout=1)
        self.shutdown_flag = Event()

    def run(self):
        while not self.shutdown_flag.is_set():
            data = self.conn.readline()
            if data != '':
                event_received(data)

def main():
    try:
        reader = RFIDReader()
        reader.start()
        while True:
            time.sleep(100)
    except (KeyboardInterrupt, SystemExit):
        reader.shutdown_flag.set()
        reader.join()
        print('\n Shutting down')


main()
