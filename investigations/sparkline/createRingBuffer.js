/* 
  createRingBuffer v001

  Ring buffer is a Queue that wraps around and provides
  get,set operations with modulo indexing.

  Enqueue/Add to back, Dequeue/Get from front.
  Think of people in line for movie.
  First in line gets serviced first.
*/
function createRingBuffer(size) {
    const buffer = new Array(size);
    const limit = size;
    let addIndex = 0;
    let getIndex = 0;

    return {
        buffer: Object.freeze(buffer),
        addIndex,
        getIndex,

        add: function(item) { // back of line == buffer.length-1
            buffer[addIndex] = { ...item }; // make copy
            addIndex = (addIndex + 1) % limit;
            return this;
        },

        replace: function(item) {        // back of line == buffer.length-1
            buffer[addIndex] = { ...item }; // make copy
            return this;
        },

        get: (key) => buffer[ key ],     // get2(key){return buffer[key];},

        getNext: function(offset = 0) {
            retIndex = getIndex;
            getIndex = (buffer.length + getIndex + offset + 1) % limit;
            return buffer[ retIndex ];
        },

        push: function(item) { 
            let i;
            for(i = limit - 1; i > 0; i = i - 1) {   // b[N-1] = b[N-2]
                buffer[i] = { ...buffer[i - 1] };            // b[1] = b[0]
            }
            buffer[0] = { ...item };
            return this;
        }
    };
}
