/*
Todo: consider pulling out FSM

controller.js

Controller related functions for:

1. handling web based command line interface
2. handling period heartbeat requests at server/json
3. finite state machine functions
*/

// FSM
function RUNNING_start(){
    return gFsmStates.RUNNING;
}

function RUNNING_stop(){
    return gFsmStates.IDLE;    
}

function IDLE_start(){
    return gFsmStates.RUNNING;    
}

function IDLE_stop(){
    return gFsmStates.IDLE;    
}

function IDLE_update(){
    return gFsmStates.IDLE;    
}

function RUNNING_update(query){
    handleGetData(query);
    return gFsmStates.RUNNING;
}

function enumToStr(stateId){
    return enumToKey(gFsmStates, stateId);
}
function enumToKeyAction(actionId){
    return enumToKey(gFsmActions,actionId);
}

function findEnumFromStateEnumArray(val) {
    return function ([s, id]) {
        return id === val;
    }
}

function enumToKey(enumerator, val){
/*
v is the enum we want to find
([s, en]) deconstructs state and enum from the array
v => ([s, en]) => en === v => Array[Array[S, ENUM]] 
returns an array of arrays that match en === v
Array[Array[S, ENUM]][0] => Array[S, ENUM]
Array[S, ENUM][0] => S
*/
    // entries are [key,val], eg [string, id]
    // [0][0] means unbox the first (and only) filtered object, [0]
    // which is an array of two elements, get the first via  [0]
    return Object.entries(enumerator).filter(([s, id]) => id === val)[0][0];
}

function isQueryString(input) {
    return /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(input);
}

function isNull(input) {
    return input === null;
}

function isAction(input) {
    return Object.keys(gFsmActions).includes(input);
}

function toQuery(acc, value, index) {
    // the first value is the action 
    // so it's concatted without the ampersand
    return index === 0 ? acc += value : acc += "&" + value;
}

function handleInput(cliInput) {
    console.log({cliInput});
    const cliTokens = cliInput.split(" ");
    const acceptable = isAction(cliTokens[0]);
    const query = cliTokens.reduce(toQuery, "?action=");

    // if acceptable action, turn the crank on client's FSM
    if (acceptable) { 

        // FSM state transition: STATE_action()
        const stateStr = enumToKeyState(getModel().stateId);
        const newStateId = window[ stateStr+"_"+cliTokens[0] ](query);
        const newStateStr =enumToKeyState(newStateId);
        console.log(`New state ${enumToKeyState(newStateId)}`);


        // if RUNNING, fetch, if IDLE, dont. => occurring in useEffect
        //  "status": "Acceptable local fsm."

        // ties REPL with FSM
        //const stateIdAfterUpdate = window[ newStateStr+"_update" ]();
        setModel({
            ...getModel(),
            stateId: newStateId
        });
        return;
    }
    
    //if (isQueryString(cliInput)) {
        // it's already a query
    //    console.log("It's a query: ", cliInput);
    //    return cliInput;
    //}
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
        console.log({heartbeatPacket});
        const IDs = new Map();

        // channels: MeterList of RingBuffers, et al
        // "Get (List) Component from Model."
        const prevChannelsJson = getModel().channels; // JSON string

        // Parsing to Array[Object] and removing Nulls
        const prevChannels = JSON.parse(
            prevChannelsJson
        ).filter(item => !isNull(item)); // Array[Object]

        // Mapper acts as ListComponent
        const channelMapper = new Map(prevChannels.map(function(channelObj) {
            return [channelObj.channel, channelObj];
        }));
        channelMapper.forEach((value, key) => 
            console.log("inside channelMapper: ", {value}, {key}))
        
        heartbeatPacket.forEach(function(nom) {
            const name = nom.channel;
            delete nom.channel;
            const channelExists = channelMapper.has(name);
           
            if (IDs.has(nom.id)) {
                console.log("Duplicate ID: ", nom.id, " detected.")
            }

            IDs.set(nom.id, nom.data);

            if (!channelExists) {
                // Create NomComponent (JSX + prop persistence )
                // Persist
                const newRb = new RingBuffer(new Array(10));
                newRb.push(nom);
                channelMapper.set(name, {
                    channel: name,
                    on: false,
                    rb: newRb.toJson()
                });
            }

            if (channelExists) {
                // returns ListElement
                const channelListObj = channelMapper.get(name); 
                const newRb = new RingBuffer(channelListObj.rb);
                newRb.push(nom);
                channelMapper.set( // channelMapper is ListComponent
                    name,
                    Object.assign(
                        channelListObj,
                        {rb: newRb.toJson()} // replace old rb with new
                    )
                );
            }

        });

        // good, add comments
        const channels = Array.from(
            channelMapper, // ListComponent
            function([channelName, channelObj]) {
                return Object.assign({channel: channelName}, channelObj);
            }
        );

        const channelNames = channels.map(item => item.channel);
        console.log({channelNames})
        setModel({
            ...getModel(),
            data: Array.from(IDs),
            channels: JSON.stringify(channels),
            channelNames 
        });
        
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
