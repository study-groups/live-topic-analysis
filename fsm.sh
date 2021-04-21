fsm-init(){
  states=("IDLE" "CONNECTED");
  actions=("start" "stop");
  curstate="IDLE"
}

fsm-next() {
  echo "Draw table before implenting" 
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

