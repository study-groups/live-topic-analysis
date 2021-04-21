export SPARK_TCP_IP=$(hostname -I) # first token is assigned to var
export SPARK_TCP_PORT=9009
PS1="tweetgen> "
lta-tweetgen-build(){
 docker build -t lta-tweetgen -f Dockerfile .
}

lta-tweetgen-kill(){
  docker container kill lta-tweetgen
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

lta-tweetgen-sim-loop(){
  while sleep 0.1; do
  local hash=$(date "+%s%N")
  local data=$(lta-tweetgen-sim-random harris border )
  cat <<EOF
{"hash":"$hash", "data":"$data"}
EOF
done | nc -lk 9010
}

lta-tweetgen-sim-random(){
  local r=$RANDOM;
  local c=$1;
  (( $r > 16000 )) || c=$2
  echo $c
}

# Dealing with Type.
# Input: JSON from Twitter API
# Output: NOM to data lake
tweet-to-nom(){
  printf "Use jq to parse from JSON ot Nodeholder Object Model objects\n"
}

