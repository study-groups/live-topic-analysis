
winpty docker run -it --rm --name appserver -u 0 -v $spth\\dashboard:/home/ds/data -p 9991:9991 --network thinkful-net thinkfulstudent/simple_server //bin/bash
