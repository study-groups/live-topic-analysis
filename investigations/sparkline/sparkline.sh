source ~/src/js-study-group/webtool/webtool.sh
app="$PWD"
src="$app/src"
PS1="sparkline> "
export VER=001
export HTTP_PORT=2600
export WS_PORT=5678
export HOSTNAME_IP=$(webtool-server-ip) # gets first IP returned
export HTML_FILE="$PWD/index.html" # nectar-server single page server

# most recently working version
js_files=(
$src/RingBuffer.js
$src/app.js
$src/dependencies.js
$src/model.js
$src/controller.js
$src/view.js
)

sparkline-build () {
  ver=${1:-"001pre1"}
  target="$app/index-$ver.html"
  linkname="$app/index.html"
  export HEADER="$(cat $src/header.html)"
  export CDN="$(cat $src/cdn.html)"
  export JS="$(cat ${js_files[@]} | envsubst)"
  export FOOTER="$(cat $src/footer.html)"
  cat $src/index.env | envsubst > $app/index-$ver.html
  rm -f $app/index.html
  ln -s $target $linkname
}

# typical use: sparkline-start index.html > sparkline.log &
sparkline-start() {
  # this is call webtool-build-hook every reload
  # should pass ports
  # implement job control, could save PID so stop can kill it easily
  # server writes log info to standard out  

  #webtool-node-server always calls webtool-build-hook before serving
  webtool-node-server  $HTTP_PORT $HTML_FILE  .
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

function qik() {
  d=$(date +%s)
  cp $1 ./$1.$d
  echo $2 > ./qik/log
}
