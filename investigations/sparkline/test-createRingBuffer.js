/* Run tests with node
    1. Run node
    2. .load fileToTest
    3. .load testFile
*/

function testSize(size) {
    const rb = createRingBuffer(size);
    const condition = !assert.equal(rb.buffer.length, size);

    if (condition) {
        console.log("Test passes: Size is as expected");
    } 
}
testSize(4);

function testPush(size) {
    const rb = createRingBuffer(size);
    rb.push({id: 1});
    rb.push({id: 2});
    const condition = !assert.deepEqual(rb.buffer[0], {id: 2}) &&
        !assert.deepEqual(rb.buffer[1], {id: 1});

    if (condition) {
        console.log("Test passes: Push method correctly pushes items forward");
    }
}
testPush(4);

function testAdd(size) {
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    const condition = !assert.deepEqual(rb.buffer[0], {id: 1}) &&
        !assert.deepEqual(rb.buffer[1], {id: 2});
    
    if (condition) {
        console.log("Test passes: Add method correctly adds items one after another.");
    }
}
testAdd(4);

function testAddOverWrite(size) {
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    rb.add({id: 5});
    const condition = !assert.deepEqual(rb.buffer[0], {id: 5});

    if (condition) {
        console.log("Test passes: Add method overwrites when buffer is full.");
    }
}
testAddOverWrite(4);

function testPushLastItemOut(size) {
    const rb = createRingBuffer(size);
    rb.push({id: 1});
    rb.push({id: 2});
    rb.push({id: 3});
    rb.push({id: 4});
    rb.push({id: 5});
    const lastItem = rb.buffer.length - 1;
    const condition = !assert.deepEqual(rb.buffer[lastItem], {id: 2});

    if (condition) {
        console.log("Test passes: Push method pushes last item out.");
    }
}
testPushLastItemOut(4);

function testReplace(size) {
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2})
    rb.replace({id: 3});
    const condition = !assert.deepEqual(rb.buffer[0], {id: 1}) 
        && !assert.deepEqual(rb.buffer[1], {id: 3});

    if (condition) {
        console.log("Test passes: Replace method replaces most recent item")
    }
}
testReplace(4);

function testGet(size) {
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    const condition = !assert.deepEqual(rb.get(2), rb.buffer[2]);

    if (condition) {
        console.log("Test passes: Get method returns correct item by index.");
    }
}
testGet(4);

function testGetNext(size) {
    const rb = createRingBuffer(size);
    rb.add({id: 1});
    rb.add({id: 2});
    rb.add({id: 3});
    rb.add({id: 4});
    const { deepEqual } = assert;
    const condition = !deepEqual(
        rb.getNext(),
        rb.buffer[0]
    )  && !deepEqual(
        rb.getNext(),
        rb.buffer[1]
    ) && !deepEqual(
        rb.getNext(),
        rb.buffer[2]
    ) && !deepEqual(
        rb.getNext(),
        rb.buffer[3]
    ) && !deepEqual(
        rb.getNext(),
        rb.buffer[0]
    );

    if (condition) {
        console.log("Test passes: GetNext method correctly gets the next item around the circular buffer.")
    }
    
}
testGetNext(4);
