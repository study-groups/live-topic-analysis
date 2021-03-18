##FROM  python:3.8-slim 
FROM python:3.9-slim-buster

MAINTAINER mike@lenan.net
RUN apt-get update
# try without nginx
#RUN apt-get install -y python3 python3-dev python3-pip nginx
RUN pip3 install ipython
#RUN pip3  install uwsgi
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]
