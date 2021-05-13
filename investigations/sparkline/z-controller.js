//CONTROLLERS
function handleGetData() {
        // GET
        fetch(DATA_SERVER_URL)
            .then(handleErrors)
            // convert Buffer to JSON
            .then(response => response.json())
            .then(function(jsonObject) {
                const dataArray = getModel().data; // ring buffer array 
                const rb = RingBuffer(dataArray);
                rb.push(jsonObject);
                //const rb2 = new RingBuffer(Array(10));
                const rb2 = new RingBuffer([1,2,3,4,5,6,7,8,9,10]);
                rb2.fromJson(getModel().data2);  // RingBuffer object
                console.log("Rb2:",rb2);
                rb2.add(jsonObject);
                console.log("Rb2 after:",rb2);
                setModel({
                    // use previous state
                    ...getModel(),
                    // old data plus the new from response
                    data: [...JSON.parse(rb.toJson()).d],
                    data2: rb2.toJson()
                });
                console.log(getModel().data);
            })
            .catch(error => console.log(error))
}

function handleClick() {
    // use previous state
    setModel({
        ...getModel(),
        // set to opposite boolean value from previous state
        isStreamOn: !getModel().isStreamOn
    });
}

function handleErrors(response) {
    // if response is not ok
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
