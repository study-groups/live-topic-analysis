import json
import os
import requests
import requests_oauthlib
import socket
import sys
import datetime

def get_tweet_stream(auth_object):
    #formulate twitter request and
    #return streaming response object
    url = 'https://stream.twitter.com/1.1/statuses/filter.json'
    query_data = [('language', 'en'),
                  ('track', 'trump, biden'),
                  ('tweet_mode','extended')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    responseTwitterStream =\
        requests.get(query_url, auth=auth_object, stream=True)
    print(f"Query: {query_url}")
    print(f"Response: {responseTwitterStream}")
    return responseTwitterStream


def connect_stream_to_spark(streamFromTwitter, sparkTcpConnection):
    #encode and send tweet data from the response
    #to a spark session
    print("Stream is Live...")
    for line in streamFromTwitter.iter_lines():
        try:
            full_tweet = json.loads(line)
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


if __name__ == "__main__":
    my_auth = requests_oauthlib.OAuth1(os.environ["TWITTER_CONSUMER_KEY"],
                                       os.environ["TWITTER_CONSUMER_SECRET"],
                                       os.environ["TWITTER_ACCESS_TOKEN"],
                                       os.environ["TWITTER_ACCESS_SECRET"])

    LOCAL_TCP_IP = socket.gethostbyname(socket.gethostname())
    SPARK_TCP_PORT = 9009

    print(f"Host: {LOCAL_TCP_IP} :: Port to Spark: {SPARK_TCP_PORT}")
    connToSpark = None
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((LOCAL_TCP_IP, SPARK_TCP_PORT))
    s.listen(1)
    print(f"Waiting for Spark to connect to us.")
    connToSpark, addr = s.accept()

    print(f"Connected... Starting getting tweets from twitter.")
    respTwitter = get_tweet_stream(my_auth)
    connect_stream_to_spark(respTwitter, connToSpark)
