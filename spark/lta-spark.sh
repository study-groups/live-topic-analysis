lta-spark-init(){
   mkdir cps
}

lta-spark-build(){
   echo "use dockerhub: jupyter/pyspark-notebook"
}

lta-spark-kill(){
  docker container kill lta-spark
}

lta-spark-start(){
docker run -it \
--rm \
--name lta-spark \
--network lta-net \
-p 8888:8888 \
-v `pwd`:/home/jovyan/work \
jupyter/pyspark-notebook:latest /bin/bash
}

lta-spark-start-notebook(){
docker run -it \
--rm \
--name lta-spark \
-p 8888:8888 \
-v `pwd`:/home/jovyan/work \
--network lta-net jupyter/pyspark-notebook
}
