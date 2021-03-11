#https://docs.docker.com/storage/volumes/

PS1="lta-dashboard> "
lta-dashboard-build(){
 docker build -t lta-dashboard -f Dockerfile  .
}

	  
# Assumes python entry point
lta-dashboard-start() {
  docker run \
  -it \
  --rm \
  --name lta-dashboard \
  -v $LTA_ROOT/dashboard:/home/ds/data \
  -p 9991:9991 \
  --network lta-net \
  lta-dashboard
}

lta-dashboard-start-cli() {
  docker run \
  --entrypoint "/bin/bash" \
  -it \
  --rm \
  --name lta-dashboard \
  -v $LTA_ROOT/dashboard:/home/ds/data \
  -p 9991:9991 \
  --network lta-net \
  lta-dashboard
}

lta-dashboard-kill() {
  docker container kill lta-dashboard
}
