from pyspark import SparkConf,SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row,SQLContext, SparkSession
import sys
import requests
import json
from datetime import datetime

#docker container name of tweet generator
TCP_TWEETGEN_HOST = "lta-tweetgen.lta-net"
#must also be specified in the tweetgen code
TCP_TWEETGEN_PORT = 9009

# docker container name of app server
# send_to_app_server will post data
TCP_APPSERVER_HOST = 'lta-dashboard.lta-net'
# must be exposed by app server docker container
TCP_APPSERVER_PORT = 9991

def send_to_app_server(rdd):
    print("IN send_to_app_server")
    #translate down to arrays to send to server
    arr = [x for x in rdd.toLocalIterator()]
    #Array of the counts of mentions
    counts = [y[1] for y in arr]
    #Array of the labels in the RDD
    topics = [y[0] for y in arr]
    req_dict = dict(zip(topics, counts))
    #add zeroes, if applicable
    for _ in trackwords.values():
        if _ not in req_dict.keys():
            req_dict[_] = 0

    # outbound to appserver
    url = 'http://{}:{}/updateData'.format(
            TCP_APPSERVER_HOST,
            TCP_APPSERVER_PORT)
    response = requests.post(url, data=req_dict)


#define a dict of topics to track and count.
#The keys are words that will be counted as a mention of the topic.
#The values are the "consolidated" topics that
# will ultimately be tracked and charted.
#All lowercase
trackwords = {'biden':'biden-was-mentioned',
              'harris':'harris-was-mentioned'}

# create spark configuration
conf = SparkConf()
conf.setAppName("TwitterStreamApp")

# create spark context with the above configuration
sc = SparkContext(conf=conf)
sc.setLogLevel("ERROR") # ALL

# create the Streaming Context from the above
#spark context with interval in sec
ssc = StreamingContext(sc, 2)

# setting a checkpoint to allow RDD recovery
#ssc.checkpoint("cps")

# Tweetgen has been started and listening on TCP_TWEETGEN_PORT
#
dataStream = ssc.socketTextStream(TCP_TWEETGEN_HOST, TCP_TWEETGEN_PORT)

# Parse the stream  such that each row is a list of length two
# The UNIX timestamp of the date, and full text of the tweet
parsedStream = dataStream.map(lambda line: [
                        datetime.strptime(
                            json.loads(line)['timestamp'],
                            '%a %b %d %H:%M:%S +%f %Y').timestamp(),
                        json.loads(line)['text'],
                                            ])

#tokenize the text of each tweet in the stream
# input: list of (time,string) pairs
# output: list of (time,list of words)

splitStream = parsedStream.map(lambda object:
                         [object[0], object[1].lower().split(' ')])

#filter stream to just the consolidated topics we want
# obj[0] is timestamp
# obj[1] is list of words
#trackwords = {'sanders':'sanders',
               'harris':'sanders',
#              'biden':'biden'}
# Contents of filteredStream is a string of either sanders or biden.
filteredStream = splitStream.map(lambda obj: [obj[0],
                [trackwords[x] for x in obj[1] if x in trackwords.keys()]])

#itemize such that each token is it's own, timestamped row

itemizedStream = filteredStream.flatMapValues(lambda _: _)

#Count tokens by tag within each batch of the stream
#This leaks the timestamp intentionally for now, though
#It will be used in future expansions of this project
tokensOnly = itemizedStream.map(lambda line: line[1])
summedStream = tokensOnly.countByValue()

#Leave the below uncommented to see what is sent in the shell
summedStream.pprint()

#Send to a server for live plotting
summedStream.foreachRDD(send_to_app_server)

# start the streaming computation
ssc.start()

# wait for the streaming to finish. This
#never ends gracefully as of now
ssc.awaitTermination()
#https://issues.apache.org/jira/browse/SPARK-17397
ssc.stop()
