//CONTROLLERS
function handleGetData() {

    const container = document.getElementById("sparkline-container");

    const options = {
        //size: [100, 20],
        size: [500, 200],
        value: {
            x: d => d.date,
            y: d => d.value
        }
    };
        // GET

/*
NOM D3 object:
ID
data.d3.tsd
{
  date:aaaa,
  value:bbbb
}
*/
    fetch(DATA_SERVER_URL) // NOM of type? 
        .then(handleErrors)
        // convert Buffer to JSON
        .then(response => response.json())
        .then(function(jsonObject) {  // NOM (id, type, data)
            const dataArray = getModel().data; // ring buffer array 
            const rb = RingBuffer(dataArray);
            rb.push(jsonObject);
            //const rb2 = new RingBuffer(Array(10));
            const rb2 = new RingBuffer([1,2,3,4,5,6,7,8,9,10]);
            rb2.fromJson(getModel().data2);  // RingBuffer object
            rb2.add(jsonObject);

            const now = Date.now();
            const lineGraph = JSON.parse(
                    rb.toJson()
            ).d.map(function (value, i) {
                return {
                    date: new Date(now - (i * 24 * 60 * 60 * 1000)),
                    value: value !== null ? value.data : 0
                };
            });
            // maybe use NOM data type as property in model. 
            // i.e. data.random becomes Random[] in the model
            // {random: Random[]}

            // Channel: defined by a unique type
            // A slot: is defined by a job ID whose data type 
            //         is consistent with the channel holding the slot.


            sparkline(container, lineGraph, options);

            console.log("lineGraph: ", lineGraph);
                            
            setModel({
                // use previous state
                ...getModel(),
                // old data plus the new from response
                data: [...JSON.parse(rb.toJson()).d],
                data2: rb2.toJson(),
                lineGraph: [...getModel().lineGraph, ...lineGraph] 
            });
            console.log(getModel());
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
