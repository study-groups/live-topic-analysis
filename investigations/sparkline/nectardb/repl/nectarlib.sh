#!/bin/bash

db="/home/admin/src/live-topic-analysis/investigations/sparkline/nectardb"
job="bayes"
log="/dev/stderr"

#  ls -d returns dir name with trailing /, sed removes it.
# TODO: refactor into channel directories under $nectardb/channels

channels=( $(cd "$db/channels";  ls -d */ | sed 's/.$//') )

# MANY TO MANY Transformation
#
# This is a server side 'dispatcher' that calls 
# update on all children that dispatches to nectardb
# channels by calling $db/$channel/update.
#
# By Convention, channel update writes to 
# $db/$channel/fifo.

# MANY TO ONE  dispatach to condenser fifo is called after.

# Save the path to this script's directory in a global env variable
#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Array that will contain all registered events
EVENTS=()

#
# @desc   :: Registers an event
# @param  :: string $1 - The name of the event. Basically an alias for a function name
# @param  :: string $2 - The name of the function to be called
# @param  :: string $3 - Full path to script that includes the function being called
#
subscribe() {
  EVENTS+=("${1};${2};${3}")
}

#
# @desc   :: Public an event
# @param  :: string $1 - The name of the event being published
#
publish() {
  for event in ${EVENTS[@]}; do 
    local IFS=";"
    read -r -a event <<< "$event"
      if [[ "${event[0]}" == "${1}" ]]; then
        ${event[1]} "$@"
      fi
  done
}

#
# Register our events and the functions that handle them
#
#subscribe "/do/work"           "action1" "${DIR}"
#subscribe "/do/more/work"      "action2" "${DIR}"
#subscribe "/do/even/more/work" "action1" "${DIR}"

#
# Execute our events
#
#publish "/do/work"
#publish "/do/more/work"
#publish "/do/even/more/work" "again"

compose(){
  turn-the-crank # on the channels
  collect-the-data # from channels to db/fifo
}

turn-the-crank(){
  # Do the updates of all channels. Their output goes in their
  # respective fifos.
  oldpwd="$pwd"
  # Many to Many, eg. Map
  for query in "${querys[@]}"
  do
    cd "$db/$job/$query"; ./update > "$db/$job/$query/fifo" &
  done
  cd $oldpwd
}

collect-the-data(){
  # Many to One
  # Collect channels into single file 
  for query in "${querys[@]}"
  do
    cat "$db/$job/$query/fifo" >> "$db/fifo" # Many to One
  done
}

nectar-repl(){
  count=${1:-1} # run compose once by default
  local state=IDLE
  local action=stop
  while [ $action = "RUNNING" ] && [ $count > 0 ]; do
    compose   # channels into single fifo
    sleep .05 # throttle
    (( count-- ))
  done
}

parse-query(){
    local saveIFS=$IFS
    IFS='=&'
    local parm=(${1:1}) # skips the question mark
    IFS=$saveIFS
    local keyValArray="${parm[@]}"
    kvs=();
    for ((i = 0; i < ${#parm[@]}; i+=2)); do
        #export "${parm[$i]}"="${parm[$i+1]}"
        kvs+=("${parm[$i]}=${parm[$i+1]}")
    done
    eval "${kvs[@]}"
    log "${kvs[@]}"
}

make-json-nom(){
cat<<EOF
{
"id": $(date +%s%N),
"type": "$1",
"data": "${@:2}"
}
EOF
}

log(){
  #echo "$1" >> $log
  echo "$1" >&2
}

log-debug-info(){
#DEBUG
echo "" > ./log
echo "job is $job before parse-query" >> ./log
echo "job is $job after parse-query" >> ./log
echo "kvs is ${kvs[@]}  after parse-query" >> ./log
echo "kv after for in kvs:" >> ./log
for kv in "${kvs[@]}"; do
    echo $kv >> ./log
    eval "$kv"
done;
}
