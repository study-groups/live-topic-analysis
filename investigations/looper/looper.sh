source ~/src/js-study-group/webtool/webtool.sh
PS1="looper> "
export VER=001
export HTTP_PORT=2020
export WS_PORT=2021
export HOSTNAME_IP=$(webtool-server-ip) # gets first IP returned
export HTML_FILE="$PWD/looper.html"
export JSON_FILE="$PWD/index.json"
export JSON_DIR="$PWD" # server assumes json-hook is in this dir
export JSON_PIPELINE_FILE="$PWD" # not used, should pass to server

webtool-build-hook(){

cat << EOF
Version: $VER
HTTP_PORT: $HTTP_PORT
WS_PORT: $WS_PORT
HOSTNAME_IP: $HOSTNAME_IP

HTML_FILE:
$HTML_FILE

JSON_FILE:
$JSON_FILE

JSON_DIR:
$JSON_DIR
(server assumes json-hook is in this dir)

# not used, should pass to server
JSON_PIPELINE_FILE:
$JSON_PIPELINE_FILE 

EOF
}

# weboot-node-server calls this every time JSON request is made
webtool-json-hook(){
   cat $JSON_FILE
  // printf  "{'id':$(date +%s%N),'type':'sparkline.data','data':$RANDOM}\n\n"
}

# typical use: sparkline-start index.html > sparkline.log &
looper-start() {
  # this is call webtool-build-hook every reload
  # should pass ports
  # implement job control, could save PID so stop can kill it easily
  # server writes log info to standard out  
  #webtool-node-server  $HTTP_PORT $HTML_FILE $JSON_FILE
  webtool-node-server  $HTTP_PORT $HTML_FILE $JSON_DIR
}

looper-stop() {
    echo "kill using jobs"
}

# Once nc (client)  has reached EOF on stdin, it (one-way) closes the
# connection /to/ the server and then waits for data coming from
# the server. 
looper-stream() {
  nc localhost ${1:-"$WS_PORT"} | while read line; do
    echo "$line"
  done 
}

looper-serve-stream(){
  while true; do                                                                
    nc -l ${1:-$WS_PORT} -q 1;
  done                                                                          
} 

looper-generate() {
  echo "Generating data on $HOSTNAME_IP:$HTTP_PORT"
  while [ 1==1 ]; do
    printf "HTTP/1.1 200 OK\n"
    printf "Access-Control-Allow-Origin: http://$HOSTNAME_IP:$HTTP_PORT\n"
    printf "Content-Type: application/json\n\n"
    printf  "{'id':$(date +%s%N),'type':'looper.data','data':$RANDOM}\n\n"
    sleep .5
  done
}
