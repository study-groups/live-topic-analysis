
winpty docker run -it --rm --name app_server -v $spth\\dashboard:/home/ds/data -p 9991:9991 --network my-net simple-flask //bin/bash
