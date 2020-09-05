FROM  python:3.8-slim 
#FROM  slim-lta
#FROM slim-dashboard
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["tweet_generator.py"]
