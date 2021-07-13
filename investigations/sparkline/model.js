// MODEL INIT
// const Model = createModel({props: {}, state: {}})
function createModel({props, state}) {
    // ListComponent?
    let _props = props;
    let _state = state;
    const mapper = new Map();
    setProps(_props);
    setState(_state);

    // action creator returns state to prop?
    return {
        mapStateToProps,
        dispatch,
        setProps,
        setState,
        getState,
        getProps
    };

    function mapStateToProp(stateVar, viewProp, fn) {
        function dispatchAction(fn) {
            const hydrateStateValue = () => getState()[stateVar] 
            return fn 
                ? () => fn(hydrateStateValue()) 
                : () => hydrateStateValue();
        }
        // A Map relationship of map.set(stateVar, viewProp)
        // A Map relationship of otherMap.set(viewProp, dispatchAction)
        // const chosenViewProp = map.get(stateVar)
        // const fn = otherMap.get(chosenViewProp)
        mapper.set(viewProp, dispatchAction);
        // mapper.set(stateVar, dispatchAction);
        const stateToProp = mapper.get(viewProp); 
        setProps({
            ...getProps(),
            [viewProp]: stateToProp()
        });
    }

    function dispatch(action) {
        mapper.get(action)();
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

    function getProps() {
        return getObject("props");
    }

    function setProps(obj) {
        /* Object.keys(obj).forEach(function(prop) {
            if(mapper.has(prop)) {
                const stateToProp = mapper.get(prop);
                setObject("props" {...getObject("props"), [prop]: stateToProp})
                delete obj[prop]
            }
        }) */
        //setObject("props", {...getObject("props"), ...obj});
        setObject("props", obj);
    }

    function getState() {
        return getObject("state");
    }

    function setState(obj) {
        setObject("state", obj);
    }

    function updateState(obj){
        setState({
            ...getState(),
            ...obj
        })
    }
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

function getState() {
    return getObject("state");
}

function setState(obj) {
    setObject("state", obj);
}

function updateState(obj){
    setState({
        ...getState(),
        ...obj
    })
}
