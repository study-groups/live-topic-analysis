const gFsmActions = Object.freeze({"start": 1, "stop": 2, "update":3 });
const gFsmStates = Object.freeze({"RUNNING": 1, "IDLE": 2});

// model assumes this function exists and will call it after setModel()
function updateView() {
    ReactDOM.render(<App  />, document.getElementById("root"));
}

/*
function updateView() {
    ReactDOM.render(<App  alive={ getProp("app","alive") } />, document.getElementById("root"));
}
*/

window.addEventListener("load", function(event) {
    localStorage.clear();
    // if local storage does NOT contain a key named "model"
    // create the key of "model" and pass its initial state
    if (localStorage.getItem("components") === null) {
       //setComponents
        

        // Concepts that may need state (and not auto update
        // view via changes to model): 
        // MVC, Heartbeat, FSM, Repl

        // These are single source of truth that the 
        // view should not know about. Instead, the controller
        // can choose to look at state to set the model.
        // setState
        setState({
               "clientHeartbeat": "clientHeartbeat not set",
               "serverHeartbeat": "May not need this.",
               "serverFsm": "Dont know server state.",
               "appFsm": gFsmStates.IDLE,
               "mvc": "mvc does not use state",
               "repl": "repl does not use state"
            }
        );

        // initial "stateToProps"
        setComponents({
            app: { 
                   status: enumToStr(getState()["appFsm"]),
                   fsmStatus: "Client FSM status"
                 },
            cli: { 
                   status: "cli status goes here"
                 },

            meterList: {
                   selected: "channelIdString"
            }

        });

        console.log("View and State initialized.");
    }
    updateView();
});
