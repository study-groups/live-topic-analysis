function RingBuffer(
    array = [],
    addIndex = 0,
    getIndex = 0,
    copy = true
) {

    let buffer;

    function _initArray(array, copy) {

        if (typeof(array) === "number") {
            buffer = new Array(array);
            return;
        }

        if (typeof(array) === "string") {
            buffer = JSON.parse(array).d;
            return;
        }

        if (copy === false) {
            buffer = array; // use reference
            return;
        }

        if (copy) {
            buffer = [...array];
            return;
        }
    }
    _initArray(array, copy);

    const len = buffer.length;

    function _shiftItems(i = len - 1) {
        if (i > 0) {
            buffer[i] = buffer[i - 1];
            return _shiftItems(i - 1);
        }
    }

    function fromJson(json) {
        const obj = JSON.parse(json);
        buffer = [...obj.d];
        addIndex = obj.w;
        getIndex = obj.r;
    }

    function toJson() {
        return JSON.stringify(
            {
                d: [...buffer],
                r: getIndex,
                w: addIndex
            }
        );
    }
    // item: Object
    function add(item) {
        buffer[addIndex] = Object.assign({}, item);
        addIndex = (addIndex + 1) % len;
    }
    // item: Object
    function push(item) {
        _shiftItems();
        buffer[0] = Object.assign({}, item);
    }
    // item: Object
    function replace(item) {
        buffer[addIndex - 1] = Object.assign({}, item);
    }

    const get = (key) => buffer[key];

    function getNext(offset = 0) {
        let retIndex = getIndex;
        getIndex = (len + getIndex + offset + 1) % len;
        return buffer[retIndex];
    }

    return {
        add,
        fromJson,
        get,
        getNext,
        getReadIndex: () => getIndex,
        getWriteIndex: () => addIndex,
        push,
        replace,
        toJson
    };
}
