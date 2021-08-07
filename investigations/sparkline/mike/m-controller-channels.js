function handleInput(cliInput) {
    if (
        /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(cliInput)
    ) {
        // it's already a query
        return cliInput
    }
    // otherwise, treat it as local control
    const query = "?" + cliInput 
            .replace(/ /g, "").replace(/,/g, "&");
    return query;
}

async function handleGetData(query) {

    try {
        const response = await fetch(DATA_SERVER_URL+query);
        const json = await response.json();
        const errors = new RingBuffer(getModel().errors);

        const appRbJson = getModel().channels[0].rb;
        const rb = new RingBuffer(appRbJson);

        // if it's not an error, push it to the stdout ringbuffer
        // otherwise, push it to the error ringbuffer
        json.type !== "data.error" ? rb.push(json) : errors.push(json);
        
        const app = {
            ...getModel().channels[0], 
            rb: rb.toJson() 
        };

        const channels = [app];

        json.type !== "data.error" 
            ? setModel({
                errors: errors.toJson(),
                channels,
                status: "OK"
            }) 

            : setModel({
                errors: errors.toJson(), 
                channels, 
                status: errors.get(0).data
            });

        //setModel({errors: errors.toJson(), channels, status: "OK"});
     
    } catch(e) {
        const message = "An error has occurred: ";
        setModel({
            ...getModel(),
            status:e.message
        });
        alert(e);
        //throw new Error(message);
    }

    
   
        //.then(handleErrors)
        //.then(response => response.json())
        //.then(function(response => response) {
/*
            console.log("server output: ", response.text());
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
 */
}

function handleClick(job) {
    const refreshedChannels = [
        ...getModel().channels
    ];
    const refreshChannelHere = refreshedChannels.findIndex(
        item => item.channel === job.channel   
    );
    
    refreshedChannels[refreshChannelHere] = {
        channel: job.channel,
        id: job.id,
        rb: job.rb,
        on: !job.on
    };
    setModel({
        channels: refreshedChannels
    });
}

function handleErrors(response) {
    // if response is not ok
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
