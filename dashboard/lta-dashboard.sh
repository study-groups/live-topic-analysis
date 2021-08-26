#https://docs.docker.com/storage/volumes/

PS1="lta-dashboard> "
lta-dashboard-build(){
 docker build -t lta-dashboard -f Dockerfile  .
}

lta-dashboard-install(){
    pip3 install -r requirements.txt 
}

lta-dashboard-start(){
    python3 app.py
}
# Assumes python entry point
lta-dashboard-start-docker() {
  docker run \
  -it \
  --rm \
  --name lta-dashboard \
  -v $LTA_ROOT/dashboard:/home/ds/data \
  -p 9991:9991 \
  --network lta-net \
  lta-dashboard
}

lta-dashboard-start-docker-cli() {
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

lta-dashboard-docker-kill() {
  docker container kill lta-dashboard
}
