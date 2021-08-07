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
                app: {
                    channel: "app",
                    on: false,
                    rb: new RingBuffer(Array(20)).toJson()
                }
                /*
                jobC: {
                    name: "jobC",
                    on: false,
                    rb: new RingBuffer(Array(10)).toJson()
                }
                */
            }
        );
        console.log("localStorage Model initialized.");
    }
    updateView();
});
