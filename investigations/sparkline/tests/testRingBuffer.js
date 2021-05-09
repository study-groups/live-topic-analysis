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
    const rb = createRingBuffer(Array(4));
    assert.equal(rb.buffer.length, 4);
}

function pushesItemsToTheNextIndex() {
    const rb = createRingBuffer(Array(4));
    rb.push({id: 1});
    rb.push({id: 2});
    assert.deepEqual(rb.buffer[0], {id: 2});
    assert.deepEqual(rb.buffer[1], {id: 1});
}

function addsItemsToTheNextIndex() {
    const rb = createRingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    assert.deepEqual(rb.buffer[0], {id: 1});
    assert.deepEqual(rb.buffer[1], {id: 2});
}

function addWillOverWrite() {
    const rb = createRingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    rb.add({id: 5});
    assert.deepEqual(rb.buffer[0], {id: 5});
}

function pushesLastItemOut() {
    const rb = createRingBuffer(Array(4));
    rb.push({id: 1});
    rb.push({id: 2});
    rb.push({id: 3});
    rb.push({id: 4});
    rb.push({id: 5});
    const lastItem = rb.buffer.length - 1;
    assert.deepEqual(rb.buffer[lastItem], {id: 2});
}

function replacesLastItemInBuffer() {
    const rb = createRingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.replace({id: 3});
    assert.deepEqual(rb.buffer[0], {id: 1});
    assert.deepEqual(rb.buffer[1], {id: 3});
}

function getsTheCorrectItemByIndex() {
    const rb = createRingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    assert.deepEqual(rb.get(2), rb.buffer[2]);
}

function getsNextItemInRingBuffer() {
    const rb = createRingBuffer(Array(4));
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    const { deepEqual } = assert;
    deepEqual(rb.getNext(), rb.buffer[0]);
    deepEqual(rb.getNext(), rb.buffer[1]);
    deepEqual(rb.getNext(), rb.buffer[2]); 
    deepEqual(rb.getNext(), rb.buffer[3]); 
    deepEqual(rb.getNext(), rb.buffer[0]);
}

function getsTheCorrectItemByIndex_CopyArray() {
    x = [ {id:1}, {id:2}, {id:3}, {id:4} ];
    const rb = createRingBuffer(x);
    assert.deepEqual(rb.get(2), rb.buffer[2]);
    assert.deepEqual(x, rb.buffer);
    x[1]={id:6};  // changing rb.buffer out from under it!
    assert.deepEqual({id:2}, rb.get(1));  // should stay 2
}

function getsTheCorrectItemByIndex_RefArray() {
    x = [ {id:1}, {id:2}, {id:3}, {id:4} ];
    y = [ {id:5}, {id:2}, {id:3}, {id:4} ];
    const rb = createRingBuffer(x,inplace=true);
    assert.notDeepEqual(x,y);
    assert.deepEqual(rb.get(2), rb.buffer[2]);
    assert.deepEqual(x, rb.buffer);
    x[1]={id:6};  // changing rb.buffer out from under it!
    assert.notDeepEqual({id:2}, rb.get(1));  // not 2
    assert.deepEqual({id:6}, rb.get(1));     // but 6! 
}


var TESTS=[];
var TESTS_SHORT=[];
TESTS_SHORT.push(sizeOfBufferIsAsExpected);

TESTS.push(
    sizeOfBufferIsAsExpected,
    pushesItemsToTheNextIndex,
    addsItemsToTheNextIndex,
    addWillOverWrite,
    pushesLastItemOut,
    replacesLastItemInBuffer,
    getsTheCorrectItemByIndex,
    getsNextItemInRingBuffer,
    getsTheCorrectItemByIndex_CopyArray,
    getsTheCorrectItemByIndex_RefArray
);

TESTS.forEach(runTest);
