/* 
  createRingBuffer v002

  Ring buffer is a Queue that wraps around and provides
  get,set operations with modulo indexing.

  Double ended queue is called a dequeue, pronounced deck.

  Enqueue/Add to back, Dequeue/Get from front.

Example of add(itemToAdd):
      itemToAdd -> [backOfLine, N-1, N-2, firstOfLine]
result:            [itemToAdd, backOfLine, N-2, N-3, firstOfLine ]
 index:               N-1         3          2    1       0

Example of push(item):
      itemToAdd -> [backOfLine, N-1, N-2, firstOfLine]
result:            [ backOfLine, N-2, N-3, firstOfLine, itemToAdd ]
 index:               N-1         3          2    1       0

Example of getNext():
      itemToAdd -> [backOfLine, N-1, N-2, firstOfLine]
result:            [ backOfLine, N-2, N-3, firstOfLine, itemToAdd ]
 index:               N-1         3          2    1       0

  Think of people in line for movie.
  First in line gets serviced first.
*/

function createRingBuffer(size) {
    const buffer = [];
    const length = size;
    let getIndex = 0;
    let addIndex = 0;

    return {
        push(item) {
            let i;
            const len = buffer.length;
            for (i=len; i > 0; i = i - 1) {
                if (i < length) {
                    buffer[i] = {...buffer[i - 1]};
                }
                if (i === length) {
                    i = i - 1;
                    buffer[i] = {...buffer[i - 1]};
                }
            }
            buffer[0] = {...item};
            addIndex = buffer.length;
            console.log(buffer);
            /*
            const len = buffer.length;
            if (len < length) {
                buffer.unshift(item);
            }
            if (len === length) {
                buffer.pop();
                buffer.unshift(item);
            }
            console.log(buffer)
            */
        },
        add(item) {
            buffer[addIndex] = {...item};
            addIndex = (addIndex + 1) % length;
            console.log(buffer)
            /*
            const len = buffer.length;
            if (len < length) {
                buffer.push(item);
            }
            if (len === length) {
                buffer.shift();
                buffer.push(item);
            }
            console.log(buffer)
            */
        },
        replace(item) {
            /*
            const len = buffer.length;
            buffer[len - 1] = item;
            console.log(buffer)
            */
            buffer[addIndex] = {...item};
            console.log(buffer)
        },
        get(key) {
            return buffer[key];
        },
        getNext(offSet = 0) {
            const retIndex = getIndex;
            getIndex = (length + getIndex + offSet + 1) % length;
            return buffer[retIndex];
        }
    };
}
