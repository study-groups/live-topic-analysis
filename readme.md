# Live Topic Analysis

Live Topic Analysis is a full-stack spark streaming based
analysis engine with real-time charting.  Keywords statistics
are analyzed in real-time over a streaming interface. It
provides live visualizations enabling further predictive
analysis on the topics.

![Process Flow](/images/Architecture.png)

## Build
`>source lta.sh
lta> lta-build-all
lta> lta-dashboard-make
lta> lta-spark-make
lta> lta-tweetgen-make;
`

## Run
`>source lta.sh
lta> lta-start-all
lta> lta-dashboard-start
lta> lta-spark-start
lta> lta-tweetgen-start;
`
Open browser at the dashboard's ip:port
`
lta> lta-help

<insert help output here>
`

## Architecture
This network of 3 docker containers streams and processes live
tweets to an in-browser chart.
- tweetgen: Python connector to Twitter API
- spark: Python wrapper arount Apache Spark
- dashboard: Python/Flask server recieves posts from spark
- dashboard-ui: JavaScript frontend, periodic JSON GET requests

### Tweet Generator
`python:latest` image from Docker hub and added `requests`
and `requests_oauthlib` to the requirements.txt.

  - IN:  connects to Twitter via streaming HTTP API (Twitter specs.)
  - OUT: listens on 9001 so Spark can connect to it (Nectar specs.)

### Spark:  `jupyter/pyspark-notebook` Docker image.
<INSERT docker command to show size of container >

  - IN: connects to 9001 to get data from Tweetgen on port 9001 (Nectar specs.)
  - OUT: Post data to Web App via HTTP on 9999 (Webapp/Nodeholder specs.)

### Dashboard: `python:latest` Docker image.
from Docker hub and added `Flask` to the requirements.txt.

  - IN: Spark API POST endpoints handled by Flask
  - OUT: Flask handles HTTP GET to send page to client (browser)
  - OUT: Flask handles periodic JSON GET requests from client
    -  JavaScript client updates cavas element via Chart.js
