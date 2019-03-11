# Live Topic Analysis

Live Topic Analysis is a full-stack spark streaming based analysis engine with real-time charting. 
The mentions of specified topics are counted over streaming 5 second intervals. It also provides live visualizations and enables further predictive analysis on the topics.

![Process Flow](/images/Architecture.png)

## Usage

Where $spth is a variable pointing to the local directory containing the project files:


- `docker network create --driver bridge my-net`
- Run twitter generator: 
  - `winpty docker run -it --rm --name data_server -v $spth:/home/ds/data --network my-net 
simple-server //bin/bash`
  - See Architecture below to create a `simple-server` image
- create directory 'cps' in the same directory as `spark-streaming.py`
- Run WebApp server by executing `app.py`, with a port exposed (9991 in this example)
  - `winpty docker run -it --rm --name app_server -v $spth:/home/app -p 9991:9991 --network 
my-net simple-flask //bin/bash`
  - See Architecture below to create a `simple-flask` image
- Run Spark Stream:
  - `winpty docker run -it --rm --name pyspark -v $spth:/home/jovyan --network my-net 
jupyter/pyspark-notebook //bin/bash`

## Architecture 
This network of 3 docker containers streams and processes live tweets to an in-browser chart. 

- Web App server: For this docker image, I simply built the `python:latest` image from Docker hub and 
added `Flask` to the requirements.txt.
- Spark: for this docker image, I used the `jupyter/pyspark-notebook` docker image, which comes ready with 
pyspark.
- Tweet Generator: For this docker image, I simply built the `python:latest` image from Docker hub and added `requests` and `requests_oauthlib` to the 
requirements.txt.


