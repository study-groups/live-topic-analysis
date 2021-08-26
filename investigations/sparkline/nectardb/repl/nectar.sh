#  The paren ( in function declaration means create a new subshell
nectar-repl()( 
    FSM_STATE="IDLE"
    states=(IDLE RUNNING); 
    actions=(start stop update create);

    # define function in new subshell (kind of like a closure)
    ctrl_c() {
        echo "** Trapped CTRL-C with FSM_STATE=$FSM_STATE"
        [ $FSM_STATE = IDLE ] && exit 
        [ $FSM_STATE != IDLE ] && FSM_STATE=IDLE
    }
    trap ctrl_c INT

    # Read, Evaluate, Print Loop & Finite State Machine
    while true; do

      local state=$FSM_STATE
      local stateIsValid=false
      local actionIsValid=false
      local newStateIsValid=false

      # blocks on input. When running, don't call.
      # When running, we need to use Unix signal ctrl-c to
      # interrupt the process. The ctrl-c interrupt handler
      # is set up above.
      [ $FSM_STATE != "RUNNING" ] && read  -p "nectar> " action data 

      if [[ $FSM_STATE == "IDLE" && $action == "$" ]]; then
          echo "${@}"
      fi 

      # Hitting return with no input (blank line == action=update)
      if [[ $FSM_STATE == "IDLE" && $action == "" ]]; then
           actionIsValid=true
           action=update
      fi 

      [ $debug ] && echo "attempting: ${state}_${action}:" "$data"

      [[ " ${actions[@]} " =~ " ${action} " ]] && actionIsValid=true

      # sunny day case, action is valid, try to call state_action(data)
      if [[ $actionIsValid == true ]]; then
          # call STATE_action in subshell, returns new STATE 
          local new_state=$( "${state}_${action}" "$data" )
          if [[ " ${states[@]} " =~ " ${new_state} " ]]; then # if valid STATE
              newStateIsValid=true
              FSM_STATE=$new_state
          fi
      fi

      # valid action but invalid return state.. emit error
      if [[ $actionIsValid != "true" ]]; then
        date +%s%N
        echo "error.action.notfound"
        echo "actionIsValid: $actionIsValid"
        echo "bad action: $action"
        echo "still using $FSM_STATE"
        echo ""
      fi 

      # valid action but invalid return state.. emit error
      if [[ $actionIsValid == true && $newStateIsValid != true ]]; then
        date +%s%N
        echo "error.state.notfound"
        echo "action:$action"
        echo "actionIsValid: $actionIsValid, newStateIsValid: $newStateIsValid"
        echo "bad state: $new_state, still using $FSM_STATE"
        echo ""
      fi 

    [ $FSM_STATE == RUNNING ] && RUNNING_update

    done < /dev/stdin
)

# IDLE STATE ACTIONS
# called by FSM, return new state as string on stdout
IDLE_start(){
  echo "RUNNING" 
}

IDLE_stop(){
  echo "$FSM_STATE" # same as IDLE
}

IDLE_create(){
  echo "$FSM_STATE" # same as IDLE
}

IDLE_update(){
    echo "IDLE"
    nectar_id=$(date +%s%N)
    ( echo -e "$nectar_id\naction.idle_update" 
      echo "FSM_STATE=$FSM_STATE"
      echo "state=$state"
      echo -e "action=$action\n"
     ) > /dev/stderr
}

# RUNNING STATE ACTIONS
RUNNING_stop(){
  echo "IDLE"
}

RUNNING_start(){
  echo "$FSM_STATE"
}

RUNNING_create(){
  echo "$FSM_STATE"  # Don't create while running, echo current state.
  ( echo "Can't create while RUNNING") > /dev/stderr
}
# write NOM object out to fifo. This is called 
# by the main while loop above.

# should call ./nectar-compose instead of having 
# code hard coded in RUNNING_update()

RUNNING_update(){
  #echo "Hit ctrl-c to stop RUNNING"

  # db for all jobs
  db="/home/admin/src/live-topic-analysis/investigations/sparkline/nectardb"
  pwd_old=$PWD
  # Call update on all subscribed channels
  job="bayes"
  param="min=1&max=10"
  channel1="$db/channels/$job/$param"
  cd $channel1 && ./update > ./fifo &

  param="min=7&max=17"
  channel2="$db/channels/$job/$param"
  cd $channel2 && ./update > ./fifo &

  cd $pwd_old

  # After all job updates fill their channel fifos, 
  # transfer all channel fifos to db fifo.
  cat $channel1/fifo > $db/fifo 
  cat $channel2/fifo > $db/fifo 
  echo "At the end of RUNNING_update" > /dev/stderr

  sleep .5  # Should be in inital variable (not run time)
}

fsm-about(){
cat << EOF

States are part of a Finite State Machine
newState=(oldState, ACTION)

This can be written as a table whose entries are 
the newState at the intersection of STATE & ACTION:

       A1  A2    A3    <- get an action
S1     
S2    newStateMatrix   <- lookup current state
S3         S4
S4         S3           <- return new state

EOF

nectar-query-string-parse(){

}
}
