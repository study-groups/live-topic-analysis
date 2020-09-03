#https://docs.docker.com/storage/volumes/

# relies on entry point defined by Dockerfile
lta-dashboard-start(){
  docker run -t -p 9991:9991 docker-slim
}

lta-dashboard-build(){
 docker build -t slim-lta -f Dockerfile  .
}

lta-dashboard-start2() {
  docker run \
  -it \
  --rm --name app_server \
  -v /home/admin/src/live-topic-analysis/dashboard:/home/ds/data \
  -p 9991:9991 \
  --network my-net simple-flask //bin/bash
}
