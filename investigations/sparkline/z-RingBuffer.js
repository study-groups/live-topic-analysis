function RingBuffer(
    array = [],
    addIndex = 0,
    getIndex = 0,
    copy = true
) {

    let buffer;

    function _initArray(array, copy) {
        if (copy === false) {
            buffer = array; // use reference
        }

        if (copy) {
            buffer = [...array];
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

    // should this be toJsonString?
    function toJson() {
        return JSON.stringify(
            {
                r: getIndex,
                w: addIndex,
                d: [...buffer]
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
        toJson,
        fromJson,
        getWriteIndex: () => addIndex,
        getReadIndex: () => getIndex,
        add,
        push,
        replace,
        get,
        getNext
    };
}
