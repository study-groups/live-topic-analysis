//CONTROLLERS

function handleGetData() {

    fetch(DATA_SERVER_URL)
        .then(handleErrors)
        .then(response => response.json())
        .then(function(jsonObject) {
            const rbJson = getModel()["app"].rb;
            const rb = new RingBuffer(rbJson);
            jsonObject.forEach(obj => rb.push(obj));
            
            const app = {
                ...getModel().app, 
                rb: rb.toJson() 
            };

            const newModel = Object.assign({}, getModel());
            console.log(newModel)
            delete newModel.app;
            const keys = Object.keys(newModel);

            keys.forEach(function(job) {
                const rb = new RingBuffer(newModel[job].rb);
                 
                const newValues = jsonObject.filter(function(item){
                    return job === item.parent;
                });

                rb.push(...newValues);
                
                newModel[job] = {
                    ...newModel[job],
                    rb: rb.toJson()
                };
            });

            setModel({
                // use previous state
                ...getModel(),
                app,
                ...newModel
            });
        })
        .catch(error => console.log(error))
}

function handleClick(job) {
    setModel({
        ...getModel(),
        [job.name]: {
            ...getModel()[job.name],
            on: !getModel()[job.name].on
        }
    });
}

function handleErrors(response) {
    // if response is not ok
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
