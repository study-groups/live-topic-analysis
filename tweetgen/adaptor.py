import json         
import os                    # for Twitter env variables
import time                  # for handling 'double-click' ctrl-c
import requests              # http connection to twitter
import requests_oauthlib     # required for twitter authentication
import sys                   # for exiting after ctrl+c
import signal                # handles ctrl-c and SIGPIPE
from enum import Enum, auto  # for state machine
import threading

class State(Enum):
    STOPPED=auto()
    RUNNING=auto()
    DONE=auto()
    PAUSED=auto()
    ERROR=auto()
    SIGPIPE=auto()

state=State.STOPPED

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

def dispatch_stream_to_fifo(streamRequest, fifoPath="./fifo"):
    global state
    fifo=open(fifoPath, 'w', 8000) # blocking call, requires a listener
    
    for line in streamRequest.iter_lines():

        if state==State.STOPPED:
            return; # let calling function handle things from here

        if state==State.PAUSED:
            state=State.PAUSED #print("In dispatch: State.PAUSED") 

        if state==State.RUNNING:
            try:
                full_tweet = json.loads(line) # line:valid JSON frm twitter
                fifo.write(line.decode("utf-8"))
                #fifo.write(json.dumps(full_tweet))
                fifo.write("\n")
            
            except Exception as e:
                e = sys.exc_info()[1]
                state=State.ERROR
                print(f"Errored without sending: {e}")
                break

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
    state=State.STOPPED
    while state != State.DONE:

        a=input(f'{state}> ')
        
        if a == 'help':
            print("Actions: help, start, stop, done")

        if state==State.STOPPED and  a == 'start':
            respTwitter = get_tweet_stream(config["auth"])
            t=threading.Thread(target=dispatch_stream_to_fifo,
                       args=(respTwitter,))
            t.daemon = True
            t.start()
            print(f"Calling dispatch_stream_to_fifo with: {respTwitter}")
            state=State.RUNNING

        if state==State.RUNNING  and  a == 'pause':
            state=State.PAUSED

        if state==State.RUNNING and a == 'stop':
            state=State.STOPPED
            respTwitter.connection.close()

        if  state==State.PAUSED and a == 'start':
            state=State.RUNNING

        if  a == 'done':
            state=State.DONE

        if  a == 'quit':
            quit()             

       
if __name__ == "__main__": main()

# https://stackoverflow.com/questions/15039528/what-is-the-difference-between-os-open-and-os-fdopen-in-python/15039662
# https://2.python-requests.org/projects/3/user/advanced/
