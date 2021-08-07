import json         
import os              # for Twitter env variables
import time            # for handling 'double-click' ctrl-c
import requests
import requests_oauthlib
import sys             # for exiting after ctrl+c
import signal          # handles ctrl-c and SIGPIPE
from enum import Enum  # for state machine

class State(Enum):
    STOPPED=0
    WAITING_ON_FIFO=1
    RUNNING=2
    STOPPING=3

state=State.STOPPED
prevTimeMs =  time.time()*1000;
def receiveSignal(signalNumber, frame):
    global prevTimeMs
    global state 
    curTimeMs=time.time()*1000;
  
    print(f'Signal handler: signal: {signalNumber}\ncurrent state:{state}')

    # SIGPIPE is sent when far end closes.
    if  signalNumber == signal.SIGPIPE:
        state=State.STOPPING

    if  signalNumber == signal.SIGINT:
        if state==State.STOPPED or state==State.STOPPING:
            sys.exit()
        if state==State.RUNNING:
            state=State.PAUSED

        if state==State.PAUSED and ( curTimeMs - prevTimeMs) < 500:
            state=State.STOPPING
            print(f'curTimeMs:{curTimeMs}')
            print(f'prevTimeMs:{prevTimeMs}')

        prevTimeMs=curTimeMs # always update prevTimeMs
    return

signal.signal(signal.SIGINT, receiveSignal)
signal.signal(signal.SIGPIPE, receiveSignal)

query_data = [('language', 'en'),
              ('track', 'trump, biden'),
              ('tweet_mode','extended')]

def get_tweet_stream(auth_object, query_data=query_data):
    #formulate twitter request and
    #return streaming response object
    url = 'https://stream.twitter.com/1.1/statuses/filter.json'
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    twitterStreamRequest = \
        requests.get(query_url, auth=auth_object, stream=True)
    return twitterStreamRequest

def dispatch_stream_to_fifo(twitterStreamRequest, fifo):
    global timeMs
    global state

    for line in twitterStreamRequest.iter_lines():

        if state==State.STOPPING:
            twitterStreamRequest.connection.close()
            state=State.STOPPED

        if state==State.STOPPED:
            return; # let calling function handle things from here

        if state==State.RUNNING:
            try:
                full_tweet = json.loads(line) # line:binary, fullTweet:dict
                fifo.write(json.dumps(full_tweet))
            
            except Exception as e:
                e = sys.exc_info()[1]
                print(f"Errored without sending: {e}")

def init_config():
    config = dict();
    config["auth"] = \
        requests_oauthlib.OAuth1( os.environ["TWITTER_CONSUMER_KEY"],
                                  os.environ["TWITTER_CONSUMER_SECRET"],
                                  os.environ["TWITTER_ACCESS_TOKEN"],
                                  os.environ["TWITTER_ACCESS_SECRET"])
    return config

def main():
    global state
    config=init_config()
    respTwitter = get_tweet_stream(config["auth"])
    print(f"Calling dispatch_stream_to_fifo with: {respTwitter}")


    state=State.WAITING_ON_FIFO 
    fd=open('./fifo','w',8000)  # blocking call, requires a listener
    state=State.RUNNING
    dispatch_stream_to_fifo(respTwitter,fd)
    print(f"After dispatch_stream_to_fifo(), state: {state}");

if __name__ == "__main__": main()
