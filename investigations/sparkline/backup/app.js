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
                isStreamOn: false,
                data: [... Array(10)],
                data2: RingBuffer([1,2,3,4,5,6,7,8,9,0]).toJson(),
                lineGraph: [{date: Date.now(), value: 1}]
            }
        );
        console.log("localStorage Model initialized.");
    }
    updateView();
});
