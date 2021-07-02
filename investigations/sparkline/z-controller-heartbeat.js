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

function IDLE_update(){
    return gStates.IDLE;    
}

function RUNNING_update(){
    handleGetData("?action=update");
    return gStates.RUNNING;
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

function findEnumFromStateEnumArray(val) {
    return function ([s, id]) {
        return id === val;
    }
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
    return Object.entries(enumerator).filter(([s, id]) => id === val)[0][0];
}

//function fsmCaller(state,action){
     
//}

function isQueryString(input) {
    return /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(input);
}

function isNull(input) {
    return input === null;
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
        const newStateId = window[ stateStr+"_"+cliInput ]();
        const newStateStr =enumToKeyState(newStateId);
        console.log(`New state ${enumToKeyState(newStateId)}`);


        // if RUNNING, fetch, if IDLE, dont. => occurring in useEffect
        //  "status": "Acceptable local fsm."

        // ties REPL with FSM
        const stateIdAfterUpdate = window[ newStateStr+"_update" ]();
        setModel({
            ...getModel(),
            stateId: stateIdAfterUpdate
        });
        return;
    }
    
    if (isQueryString(cliInput)) {
        // it's already a query
        return cliInput
    }
    /*
    // otherwise, turn it into a query
    const query = "?" + cliInput 
            .replace(/ /g, "").replace(/,/g, "&");
    return query;
    */
   
    // Otherwise, it's not a command
    setModel({...getModel(), status: "Command not found"});
}

async function handleGetData(query) {

    try {
        const response = await fetch(DATA_SERVER_URL+query);
        const heartbeatPacket = await response.json();

        // RingBuffers, et al
        const prevChannels = getModel().channels; // JSON string
        // Parsing to Array[Object] and removing Nulls
        const prevChannelData = JSON.parse(
            prevChannels
        ).d.filter(item => !isNull(item)); // Array[Object]
        const channelsRb = new RingBuffer(new Array(20));

        //console.log({prevChannels});
        //console.log({prevChannelData});
        //console.log({channelsRb});

        // Previous data and new
        const refreshedData = [
            ...prevChannelData, 
            ...heartbeatPacket
        ];

        //console.log({refreshedData});

        // Mapper
        const channelMapper = new Map();
        
        refreshedData.forEach(function(nom) {
            const name = nom.channel;
            delete nom.channel;
            const isChannel = channelMapper.has(name);

            if (!isChannel) {
                const newRb = new RingBuffer(new Array(10));
                newRb.push(nom);
                channelMapper.set(name, {
                    channel: name,
                    on: false,
                    rb: newRb.toJson()
                });
            }

            if (isChannel) {
                const channel = channelMapper.get(name);
                const prevRb = new RingBuffer(channel.rb);
                prevRb.push(nom);
                channelMapper.set(
                    name,
                    Object.assign(
                        channel,
                        {rb: prevRb.toJson()}
                    )
                );
            }

        });

        const channels = Array.from(
            channelMapper,
            function([channelName, obj]) {
                return Object.assign({channel: channelName}, obj);
            }
        );
        console.log({channels})

        channels.forEach((item) => channelsRb.push(item));
        const channelNames = channels.map(item => item.channel);
        console.log({channelNames})
        
        setModel({...getModel(), channels: channelsRb.toJson()})

        /*
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
        */
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
