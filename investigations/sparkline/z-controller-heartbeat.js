//CONTROLLERS

// Parent
            /*
               id: 001
               type: data.job
               parent: nectar
               data: ?job=tweet&lang=en

               *On the concept of an action type vs data type*
               id: 005
               type: action.job
               parent: nectar
               data: ?job=tweet&lang=en

            */
            // Child (aka data produced by the job)
            /*
                id: 1899
                type: data.tweet
                parent: 001
                data: Kraft macaroni
            */



// FSM
function RUNNING_start(){
    return gStates.RUNNING;
}

function RUNNING_stop(){
    return gStates.IDLE;    
}

function IDLE_start(){
    return gStates.RUNNING;    
}

function IDLE_stop(){
    return gStates.IDLE;    
}

/*
function Fsm(){
    states=["RUNNING", "IDLE"];
    actions=["start", "stop"];
    const fsm = new Map();

    // with enumerated states/actions
    fsm.set([states.RUNNING, actions.start],
        () => states.RUNNING);

    fsm.set("RUNNING_start", () => "RUNNING");

    return fsm;
}

fsm = Fsm();
// enumerations
newStateId=fsm.get([stateId,actionId])(inputData)
newStateId=fsm.get([states.RUNNING,actions.start])(inputData)

// via string states
newState=fsm.get(`${state}_${action}`)(inputData)
newState=fsm.get("RUNNING_start")(inputData)
*/

function enumToKeyState(stateId){
    return enumToKey(gStates,stateId);
}
function enumToKeyAction(actionId){
    return enumToKey(gActions,actionId);
}

function enumToKey(enumerator, val){
    // Object.entries(gStates) => Array[Array[S, ENUM]]
    // filter moves through the arrays
    // v is the enum we want to find
    // ([s, en]) deconstructs state and enum from the array
    // v => ([s, en]) => en === v => Array[Array[S, ENUM]] 
    // returns an array of arrays that match en === v
    // Array[Array[S, ENUM]][0] => Array[S, ENUM]
    // Array[S, ENUM][0] => S

    // entries are [k,v], eg [string, id]
    // [0][0] means unbox the first and only filtered object [0]
    // which is an array of two elements, get the first,[0]
    return Object.entries(enumerator)                
                 .filter(([s, id]) => id === val)[0][0];
}

//function fsmCaller(state,action){
     
//}

function isQueryString(input) {
    return /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(input);
}

function isAction(input) {
    return Object.keys(gActions).includes(input);
}

function handleInput(cliInput) {
    const acceptable = isAction(cliInput);

    // if acceptable action, turn the crank on client's FSM
    if (acceptable) { 

        // FSM state transition: STATE_action()
        // pseudocode:
        // const newState = "getModel().state"_"$cliInput"() 
        //const state=gStates
        //const newState = window[ getModel().state +"_stop"]();
        const stateStr = enumToKeyState(getModel().stateId);
        //const state =Object.entries(getModel().state);
        const newStateId = window[ stateStr+"_"+cliInput]();
        console.log(`New state ${enumToKeyState(newStateId)}`);

        // set model.state=newState;
        setModel({
            ...getModel(),
            stateId: newStateId
        });

        // if RUNNING, fetch, if IDLE, dont. => occurring in useEffect
        //  "status": "Acceptable local fsm."
          
        return;
    }
    
    if (isQueryString(cliInput)) {
        // it's already a query
        return cliInput
    }
    // otherwise, turn it into a query
    const query = "?" + cliInput 
            .replace(/ /g, "").replace(/,/g, "&");
    return query;
}

async function handleGetData(query) {

    try {
        const response = await fetch(DATA_SERVER_URL+query);
        const json = await response.json();
        const errors = new RingBuffer(getModel().errors);
        const heartbeat = new RingBuffer(getModel().heartbeat);

        const appRbJson = getModel().channels[0].rb;
        const rb = new RingBuffer(appRbJson);

        // if it's not an error, push it to the stdout ringbuffer
        // otherwise, push it to the error ringbuffer
        json.type === "data.error" ? errors.push(json) : 
        json.type === "data.heartbeat" ? heartbeat.push(json) :
        rb.push(json);
        
        const app = {
            ...getModel().channels[0], 
            rb: rb.toJson() 
        };

        const channels = [app];

        json.type !== "data.error" 
            ? setModel({
                ...getModel(),
                errors: errors.toJson(),
                heartbeat: heartbeat.toJson(),
                channels,
                status: "OK"
            }) 

            : setModel({
                ...getModel(),
                errors: errors.toJson(),
                heartbeat: heartbeat.toJson(),
                channels, 
                status: errors.get(0).data
            });

        //setModel({errors: errors.toJson(), channels, status: "OK"});
     
    } catch(e) {
        const message = "An error has occurred: ";
        setModel({
            ...getModel(),
            status:e.message
        });
        //alert(e);
        throw new Error(message + e.message);
    }
}

function handleClick(job) {
    const refreshedChannels = [
        ...getModel().channels
    ];
    const refreshChannelHere = refreshedChannels.findIndex(
        item => item.channel === job.channel   
    );
    
    refreshedChannels[refreshChannelHere] = {
        channel: job.channel,
        id: job.id,
        rb: job.rb,
        on: !job.on
    };
    setModel({
        channels: refreshedChannels
    });
}

function handleErrors(response) {
    // if response is not ok
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
