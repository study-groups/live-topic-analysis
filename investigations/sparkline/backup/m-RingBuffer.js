/*jslint
    node
*/

//function RingBuffer(array = [], addIndex = 0, getIndex = 0, copy = true) {
function RingBuffer(array=[],start=0,end=0,copy=true) {
    // this is the object that called us. E.g. Repl.
    //console.log("this in RingBuffer", this);
    let addIndex = start;
    let getIndex = end;
    let buffer = []; 
    initArray(array,copy); // buffer points to copy of array
    function initArray(array, copy=true){
        if( copy === false){
             buffer = array;  // use reference 
        }

        if(copy === true){
             buffer = [... array]; // make a copy
        }
    }

    function initViaSize(size){
        buffer = new Array(size);
    }

    function shiftItems(i = buffer.length - 1) {
        if (i > 0) {
            buffer[i] = buffer[i - 1];
            i = i - 1;
            return shiftItems(i);
        }
    }

        //toJson: toJson,
        // fromJson: fromJson
    function fromJson (json){
        let obj=JSON.parse(json);
        buffer=[... obj.d];
        addIndex=obj.w;
        getIndex=obj.r;
        return this; //refers to return object!
    } 

    function toJson (){
        return JSON.stringify({r:getIndex,w:addIndex,d:[...buffer]});
    }

    function add (item) { // back of line == buffer.length - 1
            buffer[addIndex] = Object(item);
            addIndex = (addIndex + 1) % buffer.length;
            console.log("addIndex, buffer",addIndex, buffer);
        }


    return {
        add,
        add2: function (item) { // back of line == buffer.length - 1
            buffer[this.addIndex] = Object(item);
            this.addIndex = (this.addIndex + 1) % buffer.length;
            console.log("addIndex, buffer",this.addIndex, buffer);
        },

        replace: function (item) {   // back of line == buffer.length-1
            buffer[addIndex - 1] = Object(item);
        },

        get: (key) => buffer[key],

        getNext: function (offset = 0) {
            let retIndex = getIndex;
            getIndex = (buffer.length + getIndex + offset + 1) % buffer.length;
            return buffer[retIndex];
        },

        push: function (item) {
            shiftItems();
            buffer[0] = Object(item);
            
        },
        buffer,
        addIndex,
        getIndex,
        toJson,
        fromJson
    };
}
