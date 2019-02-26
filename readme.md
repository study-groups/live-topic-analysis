# Live Topic Analysis

Live Topic Analysis is a full-stack spark streaming based analysis engine with real-time charting. 
The mentions of specified topics are counted over streaming 5 second intervals. It also provides live visualizations and further predictive analysis on the topics.

## Usage

Where $spth is a variable pointing to the local directory containing the project files:


- `docker network create --driver bridge thinkful-net`
- Run twitter generator: 
  - `winpty docker run -it --rm --name data_server -v $spth:/home/ds/data --network thinkful-net thinkfulstudent/simple_server //bin/bash`
- create directory 'cps' in some directory as `spark-streaming.py`
- Run Spark Stream:
  - `winpty docker run -it --rm --name pyspark1 -v $spth:/home/jovyan --network thinkful-net jupyter/pyspark-notebook //bin/bash`
- Run WebApp server by executing `app.py`
  - `winpty docker run -it --name appserver -u 0 -v $spth\\dashboard:/home/ds/data -p 9991:9991 --network thinkful-net thinkfulstudent/simple_server //bin/bash`

## Architecture 
- TBD
