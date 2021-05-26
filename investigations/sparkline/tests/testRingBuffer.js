/* Run tests with node
    1. Run node
    2. .load fileToTest
    3. .load testFile
*/

function runTest(fn) {
    try {
        fn();
        console.log("Test passes: ", fn.name);
    } catch (exception) {
        console.error(exception);
    }
}

function sizeOfBufferIsAsExpected() {
    const rb = RingBuffer(Array(4));
    const obj = JSON.parse(rb.toJson())
    assert.equal(obj.d.length, 4);
}

function instantiatesWithNumber() {
    const rb = RingBuffer(4);
    const dataArray = JSON.parse(rb.toJson()).d;
    const len = dataArray.length;
    assert.equal(len, 4)
}

function instantiatesWithJson() {
    const rb = RingBuffer(Array(4));
    rb.push({id: 1});
    rb.push({id: 2});
    rb.push({id: 3});
    const newRb = RingBuffer(rb.toJson());
    assert.equal(rb.toJson(), newRb.toJson());
}

function bufferToJson() {
    const rb = RingBuffer(Array(4));
    rb.push({id: 1});
    assert.equal(
        rb.toJson(),
        '{"d":[{"id":1},null,null,null],"r":0,"w":0}'
    );
    assert.deepEqual(
        JSON.parse(rb.toJson()),
        {"r":0, "w": 0, "d":[{"id":1},null,null,null]}
    );
}

function bufferIsPrivate() {
    const rb = RingBuffer(Array(4));
    assert.equal(rb.buffer, undefined);
}

function pushesItemsToTheNextIndex() {
    const rb = RingBuffer(Array(4));
    rb.push({id: 1});
    rb.push({id: 2});
    assert.deepEqual(
        JSON.parse(
            rb.toJson()
        ),
        {"r":0,"w":0,"d":[{"id":2}, {"id":1}, null, null]}
    );
}

function addsItemsToTheNextIndex() {
    const rb = RingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    assert.deepEqual(
        JSON.parse(
            rb.toJson()
        ),
        {"r":0,"w":2,"d":[{"id":1}, {"id":2}, null, null]}
    );
}

function addWillOverWrite() {
    const rb = RingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    rb.add({id: 5});
    assert.deepEqual(
        JSON.parse(
            rb.toJson()
        ),
        {"r":0,"w":1,"d":[{"id":5}, {"id":2}, {"id":3}, {"id":4}]}
    );
}

function pushesLastItemOut() {
    const rb = RingBuffer(Array(4));
    rb.push({id: 1});
    rb.push({id: 2});
    rb.push({id: 3});
    rb.push({id: 4});
    rb.push({id: 5});
    assert.deepEqual(
        JSON.parse(
            rb.toJson()
        ),
        {"r":0,"w":0,"d":[{"id":5}, {"id":4}, {"id":3}, {"id":2}]}
    );
}

function replacesItemInBuffer() {
    const rb = RingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.replace({id: 3});
    assert.deepEqual(
        JSON.parse(
            rb.toJson()
        ),
        {"r":0,"w":2,"d":[{"id":1},{"id":3},null,null]}
    );
}

function getsTheCorrectItemByIndex() {
    const rb = RingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    rb.replace({id: 3});
    assert.deepEqual(rb.get(2), {"id": 3});
}

function getsNextItemInRingBuffer() {
    const rb = RingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    assert.deepEqual(rb.getNext(), {id: 1});
    assert.deepEqual(rb.getNext(), {id: 2});
    assert.deepEqual(rb.getNext(), {id: 3});
    assert.deepEqual(rb.getNext(), {id: 4});
    assert.deepEqual(rb.getNext(), {id: 1});
}

function getsTheCorrectItemByIndex_CopyArray() {
    const x = [ {id:1}, {id:2}, {id:3}, {id:4} ];
    const rb = RingBuffer(x);
    assert.deepEqual(rb.get(2), {id: 3});
    assert.deepEqual(x, JSON.parse(rb.toJson()).d);
    x[1]={id:6};  // changing rb.buffer out from under it!
    assert.deepEqual(rb.get(1), {id:2});  // should stay 2
}

function getsTheCorrectItemByIndex_RefArray() {
    const x = [ {id:1}, {id:2}, {id:3}, {id:4} ];
    const y = [ {id:5}, {id:2}, {id:3}, {id:4} ];
    const rb = RingBuffer(x, 0, 0, false);
    assert.notDeepEqual(x,y);
    assert.deepEqual(rb.get(2), {id:3});
    assert.deepEqual(x, JSON.parse(rb.toJson()).d);
    x[1]={id:6};  // changing rb.buffer out from under it!
    assert.notDeepEqual(rb.get(1), {id:2});  // not 2
    assert.deepEqual(rb.get(1), {id:6});     // but 6! 
}

function getsCorrectWriteIndex() {
    const rb = RingBuffer(Array(4));
    rb.add({id:1});
    rb.add({id:2});
    assert.equal(rb.getWriteIndex(), 2);
}

function getsCorrectReadIndex() {
    const rb = RingBuffer(Array(4));
    rb.add({id:1});
    rb.add({id:2});
    rb.add({id:3});
    rb.add({id:4});
    rb.getNext();
    rb.getNext();
    assert.equal(rb.getReadIndex(), 2);
}

const TESTS = [];
//const TESTS_SHORT=[];
//TESTS_SHORT.push(sizeOfBufferIsAsExpected);

TESTS.push(
    sizeOfBufferIsAsExpected,
    instantiatesWithNumber,
    instantiatesWithJson,
    bufferToJson,
    bufferIsPrivate,
    pushesItemsToTheNextIndex,
    addsItemsToTheNextIndex,
    addWillOverWrite,
    pushesLastItemOut,
    replacesItemInBuffer,
    getsTheCorrectItemByIndex,
    getsNextItemInRingBuffer,
    getsTheCorrectItemByIndex_CopyArray,
    getsTheCorrectItemByIndex_RefArray,
    getsCorrectWriteIndex,
    getsCorrectReadIndex
);

TESTS.forEach(runTest);
process.exit(0);
