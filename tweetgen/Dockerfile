#FROM ubuntu:latest
FROM  python:3.8-slim
#FROM  slim-lta
#FROM slim-dashboard
RUN apt-get update
RUN apt-get install -y vim
RUN apt-get install -y netcat
RUN mkdir /app
COPY ./requirements.txt /app
WORKDIR /app
RUN pip3 install -r requirements.txt


ENTRYPOINT ["python3"]
CMD ["tweet_generator.py"]
