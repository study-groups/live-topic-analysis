#  The paren ( in function declaration means create a new subshell
fsm-repl()( 
    FSM_STATE="IDLE"
    states=(IDLE RUNNING); 
    actions=(start stop update);

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
      [ $FSM_STATE != "RUNNING" ] && read  -p "fsm> " action data 

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

IDLE_update(){
    echo "IDLE"
    fsm_id=$(date +%s%N)
    ( echo -e "$fsm_id\naction.idle_update" 
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

# write NOM object out to fifo. This is called 
# by the main while loop above.
RUNNING_update(){
  #echo "Hit ctrl-c to stop RUNNING"  
  #(( fsm_id++ )) # faster but not accurate time
  nom_id=$(date +%s%N)
  (echo  "$nom_id"
  echo  "type.data.random"
  echo  $RANDOM 
  echo ""
  )> ./fifo
  sleep .5
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
}
