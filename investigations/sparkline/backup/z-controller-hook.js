//CONTROLLERS

function handleGetData() {

    fetch(DATA_SERVER_URL)
        .then(handleErrors)
        .then(response => response.json())
        .then(function(jsonArray) {
            console.log(jsonArray);
            const rbJson = getModel()["app"].rb;
            const rb = new RingBuffer(rbJson);
            jsonArray.forEach(obj => rb.push(obj));
            
            const app = {
                ...getModel().app, 
                rb: rb.toJson() 
            };
            // Parent
            /*
               id: 001
               type: data.job
               parent: nectar
               data: ?job=tweet&lang=en

               *On the concept of an action type vs data type*
               id: 005
               type: action.job
               parent: nectar
               data: ?job=tweet&lang=en

            */
            // Child (aka data produced by the job)
            /*
                id: 1899
                type: data.tweet
                parent: 001
                data: Kraft macaroni
            */

            const channels = {};

            jsonArray.forEach(function({channel, data}) {

                if (channels[channel]) {
                    channels[channel] = {
                        data: [...channels[channel].data, data] 
                    };
                }

                if (!channels[channel]) {
                    channels[channel] = {
                        data: [data]
                    };
                }

            });

            setModel({
                // use previous state
                ...getModel(),
                app,
                channels
            });

            
        })
        .catch(error => console.log(error))
}

function handleClick(job) {
    setModel({
        ...getModel(),
        [job.channel]: {
            ...getModel()[job.channel],
            on: !getModel()[job.channel].on
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
