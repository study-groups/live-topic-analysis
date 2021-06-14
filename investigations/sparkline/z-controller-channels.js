//CONTROLLERS

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

function handleGetData() {

    fetch(DATA_SERVER_URL)
        .then(handleErrors)
        .then(response => response.json())
        .then(function(jsonArray) {
            console.log("original json array from server: ", jsonArray);
            // app is always in index 0
            const appRbJson = getModel().channels[0].rb;
            const rb = new RingBuffer(appRbJson);
            jsonArray.forEach(obj => rb.push(obj));
            
            const app = {
                ...getModel().channels[0], 
                rb: rb.toJson() 
            };

            const channelMapper = new Map();

            jsonArray.forEach(function(nom) {
                
                const channel = channelMapper.get(nom.channel);

                // channel already exists
                if (channel) {
                    // refresh the ringbuffer
                    const rb = new RingBuffer(channel.rb);
                    rb.push(nom); // push the new value
                    // reset the values associated with the channel
                    channelMapper.set(
                        nom.channel, 
                        {
                            ...channel,
                            rb: rb.toJson()
                        }
                    )
                }
                // if channel doesn't already exist
                if (!channel) {
                    // create ringbuffer
                    const rb = new RingBuffer(Array(10));
                    // push the value to the ringbuffer
                    rb.push(nom);
                    // set the channel as key and the object as value
                    channelMapper.set(nom.channel, {
                        channel: nom.channel,                                   
                        id: nom.id,
                        on: false,                                              
                        rb: rb.toJson()
                    });
                }

            });

            // create the channels array from the channelmapper
            const channels = Array.from(
                channelMapper,
                ([channelName, obj]) => ({ channel: channelName, ...obj})
            );

            // app is always at index 0
            const allChannels = [app, ...channels];

            setModel({channels: allChannels});

        })
        .catch(error => console.log(error))
}



function handleClick(job) {
    const refreshedChannels = [
        ...getModel().channels
    ];
    const refreshChannelHere = refreshedChannels.findIndex(
        item => item.channel === job.channel   
    );
    console.log("job: ", job);
    console.log("refresh channel index: ", refreshChannelHere);
    console.log(
        "channel to refresh: ",
        refreshedChannels[
            refreshChannelHere
        ]
    );
    
    refreshedChannels[refreshChannelHere] = {
        channel: job.channel,
        id: job.id,
        rb: job.rb,
        on: !job.on
    };
    console.log(
        "channel refreshed: ",
        refreshedChannels[
            refreshChannelHere
        ]
    );
    setModel({
        channels: refreshedChannels
    });
    console.log(getModel())
    
}

function handleErrors(response) {
    // if response is not ok
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
