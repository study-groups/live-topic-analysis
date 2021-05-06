/* Run tests with node
    1. Run node
    2. .load fileToTest
    3. .load testFile
*/

const TESTS = [];

function runTest(fn) {
    try {
        fn();
        console.log("Test passes: ", fn.name);
    } catch (exception) {
        console.error(exception);
    }
}

function sizeOfBufferIsAsExpected() {
    const size = 4;
    const rb = createRingBuffer(size);
    assert.equal(rb.buffer.length, size);
}

function pushesItemsToTheNextIndex() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.push({id: 1});
    rb.push({id: 2});
    assert.deepEqual(rb.buffer[0], {id: 2});
    assert.deepEqual(rb.buffer[1], {id: 1});
}

function addsItemsToTheNextIndex() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    assert.deepEqual(rb.buffer[0], {id: 1});
    assert.deepEqual(rb.buffer[1], {id: 2});
}

function addWillOverWrite() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    rb.add({id: 5});
    assert.deepEqual(rb.buffer[0], {id: 5});
}

function pushesLastItemOut() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.push({id: 1});
    rb.push({id: 2});
    rb.push({id: 3});
    rb.push({id: 4});
    rb.push({id: 5});
    const lastItem = rb.buffer.length - 1;
    assert.deepEqual(rb.buffer[lastItem], {id: 2});
}

function replacesLastItemInBuffer() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.replace({id: 3});
    assert.deepEqual(rb.buffer[0], {id: 1});
    assert.deepEqual(rb.buffer[1], {id: 3});
}

function getsTheCorrectItemByIndex() {
    const size = 4;
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    assert.deepEqual(rb.get(2), rb.buffer[2]);
}

function getsNextItemInRingBuffer() {
    const size = 4;
    const rb = createRingBuffer(size);
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

TESTS.push(
    sizeOfBufferIsAsExpected,
    pushesItemsToTheNextIndex,
    addsItemsToTheNextIndex,
    addWillOverWrite,
    pushesLastItemOut,
    replacesLastItemInBuffer,
    getsTheCorrectItemByIndex,
    getsNextItemInRingBuffer
);

TESTS.forEach(runTest);
