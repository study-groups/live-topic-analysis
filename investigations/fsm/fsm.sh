fsm-read(){

    # if curState not set, then curState = $FSM_STATE
    export FSM_STATE=${1:-"$FSM_STATE"} # first arg or no change

    # Read, Evaluate, Print Loop
    while read -p "fsm> " action payload; do

      local state=$FSM_STATE
      local stateIsValid=false
      local actionIsValid=false
      local type=""

      [ $debug ] && echo "attempting: ${state}_${action}:" "$payload"

       # action not found so create error nom
      if [[ ! " ${actions[@]} " =~ " ${action} " && 1 ]]; then
         local type="error.action.${action}.notfound"
      fi 
     
      # sunny day case, action is valid
      if [[  " ${actions[@]} " =~ " ${action} " && 1 ]]; then
        # call state-action in subshell, returns new state
        local new_state=$("${state}_${action}" $payload) 
        actionIsValid=true;
      fi

      # new state not found, emit error
      if [[ ! "${states[@]}" =~ "${new_state}"  || 
            $actionIsValid == false ]]; then
        local type="$type.error.state.notfound"
        date +%s%N
        echo $type
        echo "actionIsValid: $actionIsValid"
        echo "new state: $new_state"
        echo "still using $FSM_STATE" 
      fi 

      # if new state is valid, emit a nom with data as new state
      if [[ "${states[@]}" =~ "${new_state}" && $actionIsValid == true ]]
      then
        FSM_STATE=$new_state
        fsm-create-nom "${state}_${action}" $new_state
      fi 

    echo ""
    done < /dev/stdin
}

fsm-create-nom(){
  date +%s%N # id
  echo "$1"  # type
  echo "$2"  # data 
}

fsm-init(){
  FSM_STATE="IDLE"
  states=("IDLE" "RUNNING"); # should check these exist
  actions=("start" "stop");  # should check these exist
}

fsm-info(){
  echo "FSM_STATE=$FSM_STATE";
}

# generic state functions
# do nothing, return current state
state_info(){
  echo "$FSM_STATE"
}

# IDLE STATE ACTIONS
IDLE_start(){
  echo "RUNNING"
  
}

IDLE_stop(){
  echo "$FSM_STATE"
}

# RUNNING STATE ACTIONS
RUNNING_stop(){
  echo "IDLE"
}

RUNNING_start(){
  echo "$FSM_STATE"
}

fsm-about(){
cat << EOF

States are part of a Finite State Machine
newState=(oldState, ACTION)

This can be written as a table whose entries are 
the newState at the intersection of STATE & ACTION:

       A1   A2    A3   <- get an action
S1     
S2    newStateMatrix   <- lookup current state
S3
S4                     <- return new state

EOF
}
