source ~/src/js-study-group/webtool/webtool.sh
PS1="sparkline> "
export SPARKLINE_VER=001
export FETCH_PORT=2222
export IP=$(webtool-server-ip)

webtool-build-hook(){
  cat $SPARKLINE_VER.html.env | envsubst > index.html
  
}

# Once nc (client)  has reached EOF on stdin, it (one-way) closes the
# connection /to/ the server and then waits for data coming from
# the server. 
sparkline-stream() {
  nc localhost $1 | while read line; do
    echo "$line"
  done 
}


# When the server closes the connection (the other
# way: server->client), then netcat stops.
sparkline-listen() {
  local port="$1";
  echo $lastline | nc -l "$port" | while read line; do
    [ 1==1 ] && echo "$line" > sparkline-log.txt
    $lastline=$line
  done
}

#  From man mkfifo: 
#    Once you have created a FIFO special file in this way, any
#    process can open it for reading or writing, in the same way as an
#    ordinary file.  However, it has to be open at both ends
#    simultaneously before you can proceed to do any input or output
#    operations on it.  Opening a FIFO for reading normally blocks
#    until some other process opens the same FIFO for writing, and
#    vice versa.

# From man netcat:
# 0. create named pipe, a.k.a. FIFO
# 1. when nc connects, it unblocks stdin, send stdout (from socket) to fifo
# 2. start sh interactive mode and redirect stderr -> stdout
# 3. anything in FIFO came from client, send it to input of shell
sparkline-listen-remote-shell(){
   rm -f /tmp/f; mkfifo /tmp/f    # <-0
   cat /tmp/f |                   # <-3 
   /bin/sh -i 2>&1 |              # <-2 shell interprets input
   nc -l 127.0.0.1 1234 > /tmp/f  # <-1
}

sparkline-listen-loopback(){
   rm -f /tmp/f; mkfifo /tmp/f    # <-0
   cat /tmp/f |                   # <-3  no shell, just pass thru
   nc -l 127.0.0.1 1234 > /tmp/f  # <-1
}

export nom_prev=""

nom-create(){
  local nom_new=$(date +%s%N)
  local nom_parent=${1-"no-parent-id-set"}
  cat <<EOF
$nom_new
data.nom
prev:$nom_prev
EOF
  nom_prev=$nom_new
}

sparkline-listen-pubsub(){
  rm -f /tmp/f; mkfifo /tmp/f    # <-0
  cat /tmp/f |
  sparkline-filter-by-line |
  nc -l 127.0.0.1 ${1:-"1234"} >> /tmp/f 
}

id=""
type=""
data=""
sparkline-stream-to-nom(){
  read id;
  read type;
  read data;
  while read line; do
    data+=line    
  done
}

sparkline-filter-by-nom(){
  read id;
  read type;
  read data;
  while read line; do
    data+=line    
  done
  local nom="$id\n$type\n$data\n"
  while read line; do
    [ "$type" == "data.nom" ] && printf "$(nom-create)" 
    [ "$type" != "data.nom" ] && printf "$line\n" 
  done
}

sparkline-filter-by-line(){
  while read line; do
    [ "$line" == "data.nom" ] && newnom="$(nom-create )"
    [ "$line" != "data.nom" ] && printf "$line\n" 
  done
}

sparkline-data-nom(){
  local nom="$(nom-create)"
  printf "$nom" 
}

sparkline-generate() {
  while [ 1==1 ]; do
    printf "HTTP/1.1 200 OK\n"
    printf "Content-Type: application/json\n\n"
    printf  "{'id':$(date +%s%N),'type':'sparkline.data','data':$RANDOM}\n\n"
    sleep .5
  done
}

# When the server closes the connection (the other
# way: server->client), then netcat stops.
sparkline-listen-simple() {
  local port="$1";
  echo $lastline | nc -l "$port" | while read line; do
    [ 1==1 ] && echo "$line" > sparkline-log.txt
    $lastline=$line
  done
}
