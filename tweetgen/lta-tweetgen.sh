lta-tweetgen-start(){
  docker run -it --rm --name data_server \
  -v $LTA_ROOT:/home/ds/data \
  --network my-net simple-server //bin/bash
}

lta-tweetgen-build(){
 docker build -t lta-tweetgen -f Dockerfile  .
}

lta-tweetgen-start(){
  docker run -t -p 9992:9992 lta-tweetgen 
}


lta-tweetgen-start2() {
  docker run \
  -it \
  --rm --name tweetgen \
  -v $LTA_ROOT/tweetgen:/home/ds/data \
  -p 9999:9992 \
  --network my-net simple-flask //bin/bash
}

