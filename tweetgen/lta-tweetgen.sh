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

lta-tweetgen-loop(){
  while sleep 0.1; do
  local hash=$(date "+%s%N")
  local data=$(lta-tweetgen-random trump biden)
  cat <<EOF
{"hash":"$hash", "data":"$data"}
EOF
done | nc -lk 9010
}

lta-tweetgen-random(){
  local r=$RANDOM;
  local c=$1;
  (( $r > 16000 )) || c=$2
  echo $c
}
