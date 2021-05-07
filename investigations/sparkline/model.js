// MODEL INIT

// Debug
localStorage.clear();

// if local storage does already contain a key named "model"
// set the model to the most recent model
if (localStorage.getItem("model") !== null) {
    setModel({...getModel()});
}

// if local storage does NOT contain a key named "model"
// create the key of "model" and pass its initial state
if (localStorage.getItem("model") === null) {
    setObject("model",
        { 
            isStreamOn: false,
            data: [{ id: 1, type: "random.number", data: 121 }],
        }
    );
}

const MOUNT_POINT = document.getElementById("root");

// MODEL
function updateView(mountPoint = MOUNT_POINT) {
    ReactDOM.render(<App />, mountPoint);
}

function getObject(key) {
    // gets value from local storage by key
    // parses string value to object
    // returns object  
    return JSON.parse(localStorage.getItem(key));
}

function setObject(key, obj) {
    // stringifies object and assigns to key in local storage
    // returns object assignment
    localStorage.setItem(key, JSON.stringify(obj))
    return obj;
}

function getModel() {
    return getObject("model");
}

function setModel(obj) {
    setObject("model", obj);
    updateView(); // re-renders Virtual DOM tree
}

