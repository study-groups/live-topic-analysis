#!/bin/bash
PS1_OLD=$PS1
PS1="lta> "
source secrets.sh
source dashboard/lta-dashboard.sh
source spark/lta-spark.sh
source tweetgen/lta-tweetgen.sh

lta-docker-create-network(){
  docker network create --driver bridge thinkful-net
}

lta-exit(){
  PS1=$PS1_OLD
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

