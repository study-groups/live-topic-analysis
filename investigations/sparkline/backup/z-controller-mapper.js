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
            /*
            const channelMapper = new Map();

            jsonArray.forEach(function(nom) {
                channelMapper.set(nom.channel, {
                    channel: nom.channel,                                   
                    on: false,                                                  
                    rb: new RingBuffer(Array(10)).toJson()
                });
            });

            jsonArray.forEach(function(nom) {
                const channel = channelMapper.get(nom.channel);
                const rb = new RingBuffer(channel.rb);
                rb.push(nom);
                channelMapper.set(nom.channel, {...channel, rb: rb.toJson()})
            });

            const channels = Array.from(
                channelMapper,
                ([channelName, obj]) => obj
            );
            */ 
            const channels = {};

            jsonArray.forEach(function(nom) {
                channels[nom.channel] = {
                    channel: nom.channel,
                    on: false,
                    rb: new RingBuffer(Array(10)).toJson()
                };
            });

            jsonArray.forEach(function(nom) {
                const channel = channels[nom.channel];
                const rb = new RingBuffer(channel.rb);
                rb.push(nom);
                channels[nom.channel] = {...channel, rb: rb.toJson()}
            });

            setModel({
                // use previous state
                ...getModel(),
                app,
                ...channels
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
