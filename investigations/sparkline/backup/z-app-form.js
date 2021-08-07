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
                    name: "app",
                    jobId: "000",
                    on: false,
                    rb: new RingBuffer(Array(20)).toJson(),
                    cmd: ""
                },
                "001": {
                    name: "001",
                    jobId: "001",
                    on: false,
                    rb: new RingBuffer(Array(10)).toJson()
                },
                "002": {
                    name: "002",
                    jobId: "002",
                    on: false,
                    rb: new RingBuffer(Array(10)).toJson()
                },
                jobC: {
                    name: "jobC",
                    on: false,
                    rb: new RingBuffer(Array(10)).toJson()
                }
            }
        );
        console.log("localStorage Model initialized.");
    }
    updateView();
});
