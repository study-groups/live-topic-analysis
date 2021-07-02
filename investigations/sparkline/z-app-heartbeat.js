const gActions = Object.freeze({"start": 1, "stop": 2, "update":3 });
const gStates = Object.freeze({"RUNNING": 1, "IDLE": 2});

// model assumes this function exists and will call it after setModel()
function updateView() {
    ReactDOM.render(<App />, document.getElementById("root"));
}

window.addEventListener("load", function(event) {
    localStorage.clear();
    // if local storage does NOT contain a key named "model"
    // create the key of "model" and pass its initial state
    if (localStorage.getItem("model") === null) {
        setObject("model",
            {
                status: "",
                stateId: gStates.IDLE, 
                //heartbeatPackets: new RingBuffer(
                channels: new RingBuffer(new Array(20)).toJson(),
                errors: new RingBuffer(new Array(20)).toJson(),
                heartbeat: new RingBuffer(new Array(5)).toJson()
            }
        );

        // Concepts that may need state (and not auto update
        // view via changes to model): 
        // MVC, Heartbeat, FSM, Repl

        // These are single source of truth that the 
        // view should not know about. Instead, the controller
        // can choose to look at state to set the model.
        setObject("state",
            {
               "clientHeartbeat": "clientHeartbeat not set",
               "serverHeartbeat": "May not need this.",
               "serverFsm": "Dont know server state.",
               "clientFsm": gStates.IDLE,
               "mvc": "mvc does not use state",
               "repl": "repl does not use state"
            }
        )

        console.log("localStorage Model initialized.");
    }
    updateView();
});
