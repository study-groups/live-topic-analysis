source ~/src/js-study-group/webtool/webtool.sh
PS1="sparkline> "
export VER=001
export HTTP_PORT=1234
export WS_PORT=5678
export HOSTNAME_IP=$(webtool-server-ip) # gets first IP returned
export HTML_FILE="$PWD/index.html"
export JSON_FILE="$PWD/index.json"
export JSON_DIR="$PWD"

js_files=( 
./RingBuffer.js
./app.js
./dependencies.js
./model.js
./z-controller.js
./z-view.js
)

sparkline-build-mike () {
  export HEADER="$(cat ./header.html)"
  export CDN="$(cat ./cdn.html)"
  export JS="$(cat ./mike/dependencies.js \
                   ./mike/model.js \
                   ./mike/controller.js \
                   ./mike/view.js \
                   ./mike/RingBuffer.js\
                   | envsubst)"
  export FOOTER="$(cat ./footer.html)"
  cat index.env | envsubst > index-m.html
}

sparkline-start-mike() {
  webtool-node-server  1235 ./index-m.html .
}
sparkline-build () {
  export HEADER="$(cat ./header.html)"
  export CDN="$(cat ./cdn.html)"
  export JS="$(cat ${js_files[@]} | envsubst)"
  export FOOTER="$(cat ./footer.html)"
  cat index.env | envsubst > index.html
}

# weboot-node-server calls this every time JSON request is made
webtool-json-hook(){
   cat $JSON_FILE
  // printf  "{'id':$(date +%s%N),'type':'sparkline.data','data':$RANDOM}\n\n"
}

# typical use: sparkline-start index.html > sparkline.log &
sparkline-start() {
  # this is call webtool-build-hook every reload
  # should pass ports
  # implement job control, could save PID so stop can kill it easily
  # server writes log info to standard out  

  #webtool-node-server always calls webtool-build-hook before serving
  webtool-node-server  $HTTP_PORT $HTML_FILE $JSON_DIR
}

sparkline-stop() {
    echo "kill using jobs"
}

# Once nc (client)  has reached EOF on stdin, it (one-way) closes the
# connection /to/ the server and then waits for data coming from
# the server. 
sparkline-stream() {
  nc localhost ${1:-"$WS_PORT"} | while read line; do
    echo "$line"
  done 
}

sparkline-serve-stream(){
  while true; do                                                                
    nc -l ${1:-$WS_PORT} -q 1;                                                      
  done                                                                          
} 

sparkline-generate() {
  echo "Generating data on $HOSTNAME_IP:$HTTP_PORT"
  while [ 1==1 ]; do
    printf "HTTP/1.1 200 OK\n"
    printf "Access-Control-Allow-Origin: http://$HOSTNAME_IP:$HTTP_PORT\n"
    printf "Content-Type: application/json\n\n"
    printf  "{'id':$(date +%s%N),'type':'sparkline.data','data':$RANDOM}\n\n"
    sleep .5
  done
}

function qik(){
  d=$(date +%s)
  cp $1 ./$1.$d
  echo $2 > ./qik/log
}
