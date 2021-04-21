# https://stackoverflow.com/questions/7354476/python-socket-object-accept-time-out/41643863#41643863

# https://stackoverflow.com/a/62254442/4249785
# https://stackoverflow.com/a/41643863/4249785
# https://stackoverflow.com/a/1955555/4249785
# https://github.com/docnow/twarc
# https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data

import json
import os
import requests
import requests_oauthlib
import socket
import sys
import datetime
import signal

state="running"
def receiveSignal(signalNumber, frame):
    print('Received:', signalNumber)
    state="stopping" # used by connect_stream_to_spark
    #s.close()
    sys.exit();
    return
signal.signal(signal.SIGINT, receiveSignal)

def get_tweet_stream(auth_object):
    #formulate twitter request and
    #return streaming response object
    url = 'https://stream.twitter.com/1.1/statuses/filter.json'
    query_data = [('language', 'en'),
                  ('track', 'trump, biden'),
                  ('tweet_mode','extended')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    twitterStreamRequest =\
        requests.get(query_url, auth=auth_object, stream=True)
    print(f"Query: {query_url}")
    print(f"Response: {twitterStreamRequest}")
    return twitterStreamRequest

def connect_stream_to_spark(twitterStreamRequest, sparkTcpConnection):
    #encode and send tweet data from the response
    #to a spark session
    print("Stream is Live...")
    for line in twitterStreamRequest.iter_lines():
        if state=="stopping":
            streamFromTwitter.connection.close()

        try:
            full_tweet = json.loads(line) # line:binary, fullTweet:dict
            sys.stderr.write(json.dumps(full_tweet))
            timestamp = full_tweet['created_at']
            #ensure full text of tweet is collected:
            if full_tweet['truncated']:
                tweet_text = full_tweet['extended_tweet']['full_text']
            else:
                tweet_text = full_tweet['text']
            #Uncommend the below to see the data in the shell
            print(f"Created at: {timestamp.encode('utf-8')}")
            print(f"Tweet Text: {tweet_text.encode('utf-8')}")
            print("------------------------------------------")
            tweet_info = json.dumps({
                            'timestamp':timestamp,
                            'text':tweet_text,
                            }).encode('utf-8')
            #Send the encoded json bytes.
            #The trailing newline is needed to trigger
            #the consistent receipt in spark as RDDs
            sparkTcpConnection.send(tweet_info+b'\n')
        except Exception as e:
            e = sys.exc_info()[1]
            print(f"Errored without sending: {e}")


# Tweet is a type we define based off of Twitter API output.


gTweet = dict() 

def init_config():
    gTweet["auth"] = requests_oauthlib.OAuth1(os.environ["TWITTER_CONSUMER_KEY"],
                                   os.environ["TWITTER_CONSUMER_SECRET"],
                                   os.environ["TWITTER_ACCESS_TOKEN"],
                                   os.environ["TWITTER_ACCESS_SECRET"])
    gTweet["SPARK_TCP_IP"] = socket.gethostbyname(socket.gethostname())
    gTweet["SPARK_TCP_PORT"] = int(os.environ["SPARK_TCP_PORT"])

def main():

    init_config()

    print(f'Host:{gTweet["SPARK_TCP_IP"]} ::')
    print( f'Port to Spark: {gTweet["SPARK_TCP_PORT"]}')

    connToSpark = None
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((gTweet["SPARK_TCP_IP"], gTweet["SPARK_TCP_PORT"]))
    s.listen(1) # number of connections, could be more

    print(f"Waiting for Spark Collector to connect to us.")
    connToSpark, addr = s.accept()

    print(f"Connected... Starting getting tweets from twitter.")
    respTwitter = get_tweet_stream(gTweet["auth"])
    connect_stream_to_spark(respTwitter, connToSpark)

if __name__ == "__main__": main()
