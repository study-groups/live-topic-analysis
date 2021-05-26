//CONTROLLERS
function handleGetData(job) {
/*
NOM D3 object:
ID
data.d3.tsd
{
  date:aaaa,
  value:bbbb
}
*/
    fetch(DATA_SERVER_URL) // FIX: fetch particular job ID and time window
        .then(handleErrors)
        // converts Buffer to JSON
        .then(response => response.json())
        .then(function(jsonObject) {  // NOM (id, type, data)
            const rbJson = getModel()[job.name].rb;
            const rb = new RingBuffer(rbJson);
            rb.push(jsonObject);

            // maybe use NOM data type as property in model. 
            // i.e. data.random becomes Random[] in the model
            // {random: Random[]}

            // Channel: defined by a unique type
            // A slot: is defined by a job ID whose data type 
            //         is consistent with the channel holding the slot.

            setModel({
                // use previous state
                ...getModel(),
      
                // old data plus the new from response
                [job.name]: {
                    ...getModel()[job.name],
                    rb: rb.toJson()
                }
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
