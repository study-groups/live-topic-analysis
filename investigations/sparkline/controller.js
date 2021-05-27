//CONTROLLERS
function handleGetData() {

    fetch(DATA_SERVER_URL)
        .then(handleErrors)
        .then(response => response.json())
        .then(function(jsonObject) {
            const rbJson = getModel()["app"].rb;
            const rb = new RingBuffer(rbJson);
            //rb.push(jsonObject);
            rb.push(jsonObject[0]);
            rb.push(jsonObject[1]);

            jsonObject.forEach( function(obj) {
                if(obj.parent=="001"){
                    const rbJobJson = getModel()[obj.parent].rb;
                    const rbJob = new RingBuffer(rbJobJson);
                    rbJob.push(obj);
                    setModel({
                    // use previous state
                    ...getModel(),
          
                    // old data plus the new from response
                    [obj.parent]: {
                            ...getModel()[obj.parent],
                            rb:rbJob.toJson()
                        }
                    });
                } 
            });
                        
            setModel({
                // use previous state
                ...getModel(),
      
                // old data plus the new from response
                ["app"]: {
                    ...getModel()["app"],
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
