function createRingBuffer(size) {
    const buffer = new Array(size);
    const limit = size;
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
        addIndex,
        getIndex,

        add: function (item) { // back of line == buffer.length - 1
            buffer[addIndex] = item; 
            addIndex = (addIndex + 1) % limit;
            console.log(buffer);
        },

        replace: function (item) {   // back of line == buffer.length-1
            buffer[addIndex - 1] = item; 
            console.log(buffer);
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
            console.log(buffer);
        }
    };
}
