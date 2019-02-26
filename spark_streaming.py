from pyspark import SparkConf,SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row,SQLContext, SparkSession
import sys
import requests
import json
from datetime import datetime


TCP_REMOTE_HOST = "data_server" #or whatever you named the docker contai$
TCP_PORT_INPUT = 9009 #must also be specified in the server file
#TCP_PORT_OUTPUT = 9991

# create spark configuration
conf = SparkConf()
conf.setAppName("TwitterStreamApp")

# create spark context with the above configuration
sc = SparkContext(conf=conf)
sc.setLogLevel("ERROR")

# create the Streaming Context from the above spark context with interval
#size 5 seconds
ssc = StreamingContext(sc, 5)

# setting a checkpoint to allow RDD recovery
ssc.checkpoint("cps")

# read data from TCP
dataStream = ssc.socketTextStream(TCP_REMOTE_HOST, TCP_PORT_INPUT)

def getSparkSessionInstance(sparkConf):
    if ("sparkSessionSingletonInstance" not in globals()):
        globals()["sparkSessionSingletonInstance"] = SparkSession \
            .builder \
            .config(conf=sparkConf) \
            .getOrCreate()
    return globals()["sparkSessionSingletonInstance"]

def showrdd(time, rdd):
    #This is a debugging function used only for 
    #displaying the stream in a non-encoded format
    try:
        # Get spark sql singleton context from the current context
        spark = getSparkSessionInstance(rdd.context.getConf())
        #this returns a PipelinedRDD
        row_rdd = rdd.map(lambda w: Row(ts=w[0], tx=w[1]))
        #create df then show as desired
        df = spark.createDataFrame(row_rdd)
        df.show(1, truncate=False)
    except Exception as e:
        e = sys.exc_info()[1]

def send_to_app_server(rdd):
    #translate down to arrays to send to server
    arr = [x for x in rdd.toLocalIterator()]
    #Array of the counts of mentions
    times = [y[1] for y in arr]
    #Array of the labels in the RDD
    tags  = [y[0] for y in arr]
    url = 'http://2367817035da:9991/updateData' #make port a var?
    request_data = {'times': times, 'tags': tags}
    response = requests.post(url, data=request_data)

#Parse the stream  such that each row is a list of length two
#The UNIX timestamp of the date, and full text of the tweet
parsedStream = dataStream.map(lambda line: [
                        datetime.strptime(
                            json.loads(line)['timestamp'],
                            '%a %b %d %H:%M:%S +%f %Y').timestamp(),
                        json.loads(line)['text'],
                                            ])

#tokenize the text of each tweet in the stream
splitStream = parsedStream.map(lambda line:
                         [line[0], line[1].lower().split(' ')])

#define a list of words to track and count
trackwords = ['warriors', 'clippers']

#filter stream to just the words we want 
filteredStream = splitStream.map(lambda line: [line[0],
                                   #Exclusive:
                                   #[x for x in line[1] if len(x)>0 and x not in stops]])
                                   #Inclusive:
                                   [x for x in line[1] if x in trackwords]])

#itemize such that each token is it's own, timestamped row
itemizedStream = filteredStream.flatMapValues(lambda _: _)


#Count tokens by tag within each batch of the stream
#This leaks the timestamp intentionally for now, though
#It may be used in future expansions
tokensOnly = itemizedStream.map(lambda line: line[1])
summedStream = tokensOnly.countByValue()

#Send to a server for live plotting
summedStream.foreachRDD(send_to_app_server)


#Run this to see the string version for debugging
#displ = filteredStream.foreachRDD(showrdd)
#Or, use this to see the bytes version
summedStream.pprint()


# start the streaming computation
ssc.start()

# wait for the streaming to finish. This
#never ends gracefully as of now
ssc.awaitTermination()
#https://issues.apache.org/jira/browse/SPARK-17397
ssc.stop()



