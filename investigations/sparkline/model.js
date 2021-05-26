// MODEL INIT
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
