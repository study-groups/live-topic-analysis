from pyspark import SparkConf,SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row,SQLContext, SparkSession
import sys
import requests
import json
from datetime import datetime

TCP_REMOTE_HOST = "lta-tweetgen.lta-net" 
TCP_PORT_INPUT = 9010 
FILE_OUTPUT = "./data.json"

# Data format: 
#{"hash":"1234567901234567","data":"A"}

def send_to_file(rdd):
    arr = [x for x in rdd.toLocalIterator()]
    
    counts = [y[1] for y in arr ]

    #Array of the labels in the RDD
    topics = [y[0] for y in arr]

    req_dict = dict(zip(topics, counts))

    for _ in trackwords.values():
        if _ not in req_dict.keys():
            req_dict[_] = 0

    url = f'{FILE_OUTPUT}'
    print(f'{url} {arr}' )
 

trackwords = {'trump':'trump',
              'biden':'biden'}

conf = SparkConf()
conf.setAppName("TwitterStreamApp")
sc = SparkContext(conf=conf)
sc.setLogLevel('ERROR')

ssc = StreamingContext(sc, 2) # 2 sec interval

dataStream = ssc.socketTextStream(TCP_REMOTE_HOST, TCP_PORT_INPUT)

#Parse the stream 

parsedStream = dataStream.map(
		lambda line: [
                  datetime.strptime(
                    json.loads(line)['timestamp'],
                    '%a %b %d %H:%M:%S +%f %Y').timestamp(),
                    json.loads(line)['text'],
                ])

#tokenize the text of each tweet in the stream
splitStream = parsedStream.map(lambda line:
                         [line[0], line[1].lower().split(' ')])

#filter stream to just the consolidated topics we want
filteredStream = splitStream.map(lambda line: [line[0],
                [trackwords[x] for x in line[1] if x in trackwords.keys()]])

#itemize such that each token is it's own, timestamped row
itemizedStream = filteredStream.flatMapValues(lambda _: _)


#Count tokens by tag within each batch of the stream
tokensOnly = itemizedStream.map(lambda line: line[1])
summedStream = tokensOnly.countByValue()

#Leave the below uncommented to see what is sent in the shell
summedStream.pprint()

summedStream.foreachRDD(send_to_file)

#ssc.start()
#ssc.awaitTermination()
#ssc.stop()
