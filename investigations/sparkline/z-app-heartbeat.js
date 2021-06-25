const gActions = Object.freeze({"start": 1, "stop": 2});
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
                stateId: gStates.RUNNING, 
                //heartbeatPackets: new RingBuffer(
                channels: [
                    {
                        channel: "app",
                        on: false,
                        id: "app",
                        rb: new RingBuffer(Array(20)).toJson()
                    }
                ],
                errors: new RingBuffer(Array(20)).toJson(),
                heartbeat: new RingBuffer(Array(5)).toJson()
            }
        );
        console.log("localStorage Model initialized.");
    }
    updateView();
});
