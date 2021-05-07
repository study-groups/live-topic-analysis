//CONTROLLERS
function handleGetData() {
        // GET
        fetch(DATA_SERVER_URL)
            .then(handleErrors)
            // convert Buffer to JSON
            .then(response => response.json())
            .then(function(response) {
                // set new model
                setModel({
                    // use previous state
                    ...getModel(),
                    // old data plus the new from response
                    data: [...getModel().data, response]
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


