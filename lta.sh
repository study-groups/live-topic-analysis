#!/bin/bash
PS1_OLD=$PS1
source secrets.sh
source dashboard/lta-dashboard.sh
source spark/lta-spark.sh
source tweetgen/lta-tweetgen.sh
PS1="lta> "

lta-docker-create-network(){
  docker network create --driver bridge lta-net
}

lta-docker-init(){
  sudo usermod -aG docker admin
  echo "requires logging out and back in."
  echo "to test, try: docker volumes ls"
}

lta-docker-list(){
  docker image list
  docker container list
}

lta-exit(){
  PS1=$PS1_OLD
}

lta-help(){
 cat << EOF
To run Live Topic Analysis:

lta-dashboard-start  # spark posts to this webserver
lta-tweetgen-start   # listens for spark connection
lta-spark-start      # connects to tweetgen, receives tweet stream

Type lta-<tab> to see possible commands.

Notes:

To be used in the context of nom-find:

nom-find "type=twitter where tag=biden"  |
   tweets-to-lines |
   lines-to-sentiments |
   sentiments-to-avg  |
    nom-write-to-lake

 Summary of pipeline:
   tweetgen-listens-on-9009 |
   spark-connects-to-9009-and-9991 |
   dashboard-listens-on-9991
EOF
}
