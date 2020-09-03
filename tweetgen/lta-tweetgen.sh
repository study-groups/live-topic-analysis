lta-tweetgen-build(){
 docker build -t lta-tweetgen -f Dockerfile .
}

lta-tweetgen-start() {
  docker run \
  -it \
  --rm \
  --name lta-tweetgen-instance \
  -p 9009:9009 \
  -v $LTA_ROOT/tweetgen:/home/ds/data \
  -e TWITTER_CONSUMER_KEY \
  -e TWITTER_CONSUMER_SECRET \
  -e TWITTER_ACCESS_TOKEN \
  -e TWITTER_ACCESS_SECRET \
   lta-tweetgen 
}

