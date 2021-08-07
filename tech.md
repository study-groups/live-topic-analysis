# Live Topic Analysis

Live Topic Analysis is a full-stack spark streaming based
analysis engine with real-time charting.  Keywords statistics
are analyzed in real-time over a streaming interface. It 
provides live visualizations enabling further predictive
analysis on the topics.

![Process Flow](/images/Architecture.png)

## Usage

`>source lta.sh
lta> lta-help

<insert output here>

lta> lta-dashboard-make 
lta> lta-spark-make
lta> lta-tweetgen-make;


lta> lta-dashboard-start
lta> lta-
Where $LTA_ROOT is a variable pointing to the local directory
containing `lta.sh`. 


- `docker network create --driver bridge lta-net`
- Run **tweet generator**:
  - `docker run -it --rm  \
        --name tweetgen \
       -v $lta_root:/home/ds/data \ 
        --network my-net \
     tweetgen //bin/bash`
  - See Architecture below to create a `simple-server` image
- create directory 'cps' in the same directory as `spark-streaming.py`

- Run **WebApp server dashboard** by executing `app.py`, with a
port exposed (9991 in this example)

  - `docker run -it --rm --name app_server -v $lta_root:/home/app -p 9991:9991 --network
my-net simple-flask //bin/bash`
  - See Architecture below to create a `simple-flask` image

- Run **Spark Stream**:
  - `docker run -it --rm --name pyspark -v $lta_root:/home/jovyan --network my-net
jupyter/pyspark-notebook //bin/bash`

## Architecture
This network of 3 docker containers streams and processes live
tweets to an in-browser chart.

- Tweet Generator:
`python:latest` image from Docker hub and added `requests`
and `requests_oauthlib` to the requirements.txt. This tweet
generator

  - IN:  connects to Twitter via streaming HTTP API (Twitter specs.)
  - OUT: listens on 9001 so Spark can connect to it (Nectar specs.)

- Spark: for this docker image, I used the `jupyter/pyspark-notebook`
docker image, which comes ready with pyspark.

  - IN: connects to 9001 to get data from Tweetgen on port 9001 (Nectar specs.)
  - OUT: Post data to Web App via HTTP on 9999 (Webapp/Nodeholder specs.)

- Web App server: This docker image is built from the
`python:latest` image from Docker hub and added `Flask` to the
requirements.txt.

  - IN: Listens to posts to API endpoints handled by Flask (Webapp/Nodeholder)
  - OUT: Adds points to Chart.js (Chart.js spec, data to go to local storage)
