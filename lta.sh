#!/bin/bash
PS1="lta> "
LTA_ROOT="/home/mricos/src/study-groups/live-topic-analysis"
CONSUMER_KEY=""
CONSUMER_SECRET=""
ACCESS_TOKEN=""
ACCESS_SECRET=""
source dashboard/lta-dashboard.sh
source spark/lta-spark.sh
source tweetgen/lta-tweetgen.sh

lta-docker-create-network(){
  docker network create --driver bridge thinkful-net
}

lta-help(){
  echo "\
To run Live Topic Analysis:

lta-dashboard-start
lta-spark-start
lta-tweetgen-start

Type lta-<tab> to see possible commands.
"
}

