#https://docs.docker.com/storage/volumes/
lta-dashboard-build(){
 docker build -t lta-dashboard -f Dockerfile  .
}

lta-dashboard-start-simple(){
  docker run -t lta-dashboard -p 9991:9991 lta-dashboard
}

lta-dashboard-start() {
  docker run \
  -it \
  --rm \
  -d \
  --name lta-dashboard \
  -v $LTA_ROOT/dashboard:/home/ds/data \
  -p 9991:9991 \
  --network lta-net lta-dashboard 
}

lta-dashboard-kill() {
  docker container kill lta-dashboard

}
