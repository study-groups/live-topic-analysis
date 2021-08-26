// MODEL INIT
/*
const model = Model({
    components: { 
        app: propsForApp,
        cli: propsForCli
    }, 
    state: {}
});
*/

function Model({components, state}) {
    
    let _components = components;
    let _state = state;

    const mapper = new Map();
    setComponents(_components);
    setState(_state);

    // action creator returns state to prop?
    return {
        getProps,
        setProps,
        updateState,
    };

/*
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
*/
    function _getObject(key) {
        // gets value from local storage by key
        // parses string value to object
        // returns object  
        return JSON.parse(localStorage.getItem(key));
    }

    function _setObject(key, obj) {
        // stringifies object and assigns to key in local storage
        // returns object assignment
        localStorage.setItem(key, JSON.stringify(obj))
        return obj;
    }

    // Returns an object with key/val for mapping (not itterating)
    // key = unique name of an instantiated component
    //components={c1:{p1:v1,p2:v2},c2:{p3:v3,p4:v4}}


    function getComponents() {
        return _getObject("components");
    }

    function getComponent(name) {
        return getComponents()[name];
    }

    function setComponents(obj) {
        setObject("components", obj);
    }

    function updateComponents(obj) {
        setComponents({
            ...getComponents(),   
            ...obj 
        });
    }

    function getProps(nameOfComponent) {
        return getComponents()[nameOfComponent];
    }

    function setProps(nameOfComponent, obj) {
        setComponents({...getComponents, [nameOfComponent]: obj});
    }

    function getState() {
        return _getObject("state");
    }

    function setState(obj) {
        _setObject("state", obj);
    }

    function updateState(obj){
        setState({
            ...getState(),
            ...obj
        })
    }
}

// Returns an object with key/val for mapping (not itterating)
// key = unique name of an instantiated component
function getComponents() {
    return getObject("components");
}

function getComponent(name) {
    return getComponents()[name];
}

function setComponents(obj) {
    setObject("components", obj);
}

//components={c1:{p1:v1,p2:v2},c2:{p3:v3,p4:v4}}

function updateComponents(obj) {
// {app: {status: "", } }
    setComponents({
        ...getComponents(), // {"app": "old", "cli": "code"}  
        ...obj // {"app": "new"}
    });
}

function getProp(comp,prop){
    return getComponent(comp)[prop];
}

function setProp(compName,prop,val){
    let props = getComponent(compName);
    props[prop] = val;
    let obj = {};
    obj[compName]={ ...props }; // obj= {"app": {"prop1":val1,"prop2": val2} }

    //setComponents( ...getComponents(), { `${compName}`: props } );
    // I believe this is updateComponents
    updateComponents( obj );
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
