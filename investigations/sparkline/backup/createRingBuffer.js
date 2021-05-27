/*jslint
    node
*/

function createRingBuffer(x=0, inplace=false) {
     let buffer;
     if(typeof(x)==="number"){
        buffer = new Array(x);
    }

    if(Array.isArray(x) && inplace === true){
         console.log("USING INPLACE, NO COPY")
         buffer = x;  // dangerously use reference 
    }

    if(Array.isArray(x) && inplace === false){
         buffer = [... x]; // make a copy
    }

    const limit = buffer.length;
    let addIndex = 0;
    let getIndex = 0;

    function pushItems(i = limit - 1) {
        if (i > 0) {
            buffer[i] = buffer[i - 1];
            i = i - 1;
            return pushItems(i);
        }
    }

    return {
        buffer,
        hello: "hello",
        addIndex,
        getIndex,

        add: function (item) { // back of line == buffer.length - 1
            buffer[addIndex] = item;
            addIndex = (addIndex + 1) % limit;
        },

        replace: function (item) {   // back of line == buffer.length-1
            buffer[addIndex - 1] = item;
        },

        get: (key) => buffer[key],

        getNext: function (offset = 0) {
            let retIndex = getIndex;
            getIndex = (buffer.length + getIndex + offset + 1) % limit;
            return buffer[retIndex];
        },

        push: function (item) {
            pushItems();
            buffer[0] = item;
        }
    };
}
