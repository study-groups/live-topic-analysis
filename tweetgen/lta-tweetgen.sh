lta-tweetgen-build(){
 docker build -t lta-tweetgen -f Dockerfile .
}

lta-tweetgen-start() {
  docker run \
  -it \
  --entrypoint "/bin/bash" \
  --rm \
  --name lta-tweetgen \
  --network lta-net \
  -p 9009:9009 \
  -v /home/admin/src/live-topic-analysis/tweetgen:/app \
  -e TWITTER_CONSUMER_KEY \
  -e TWITTER_CONSUMER_SECRET \
  -e TWITTER_ACCESS_TOKEN \
  -e TWITTER_ACCESS_SECRET \
   lta-tweetgen 
}

