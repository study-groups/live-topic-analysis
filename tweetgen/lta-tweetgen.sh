lta-tweetgen-start(){
  docker run -it --rm --name data_server \
  -v $LTA_ROOT:/home/ds/data \
  --network my-net simple-server //bin/bash
}
