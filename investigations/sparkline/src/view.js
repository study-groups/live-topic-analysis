
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

// VIEW
// maybe for a more dynamic structure.
// WIP
// packet.forEach(data => Component(data.type)) just musing

function createComponent(nom) {
    // type
    // props
    // nomToProps
    // parent
    // children
    // render/update
    const type = nom.type.split(".")[1];
}

function Node(props) {
    return <span> {props.data} </span>;
}

function createGraphNode(nomObj) {
    const { data, id, type } = nomObj;
    return <Node data={data} key={id} />;
}

function HeartbeatStatus(props) { 
    // if first byte null, return null (react-ism) instead of Element
    return !props.heartbeat.d[0] 
        ? null 
        : (
            <span style={
                {color: "gray"}
            }>
                {props.heartbeat.d[0].data}
            </span>
        );
}

function JobBoard(props) {
    return (
        <React.Fragment>
            <div>Job "{props.channel}":</div> 
            <div>
                {
                    props.data.map(createGraphNode)
                }
            </div>
            <br />
        </React.Fragment>
    );
}

function createJobBoard({channel, on, rb}) {
    const noms = JSON.parse(rb).d.filter(nom => nom !== null);
    return (
        <JobBoard key={channel} data={noms} channel={channel} />
    );
}

function objToComponent(obj) {
    return window[obj.type];
}

/*
function render(type) {
// type: Cli
    return () => getObject(
        "view"
    ).components
    .filter(component => component.type === type)
    .map(objToComponent);
}
*/

// "The Barber" called by App useEffect().  Calls update on all
// components (stateToProps) before render() functions grab
// data from Model.componentName.props.
//function appUpdate(){
function stateToProps(){

    const clientFsmStateStr = enumToStr(getState()["appFsm"]);
    setProp("app","clientFsmState", clientFsmStateStr);
    setProp("app","clientHeartbeat", getState()["clientHeartbeat"]);

    // Alternative way of updating all components at a time
/*    updateComponents({
            app: { 
                 ...getComponents()["app"],
                 clientHeartbeat:getState()["clientHeartbeat"]
            }
        }
    );
*/
}

// The Barber's FSM: 
// ACTION: toggle
// STATES: dead, alive
// dead_toggle => alive
// alive_toggle => dead
let alive=true;
function App() {
    // Since we are passing [] as second paramenter to useEffect,
    // it  is really "onMount" and returns "onUnmount".
    //const alive = getProp("app", "alive");
    useEffect( function() {
            let interval=null;
            interval = setTimeout(function heartbeat() { 
                console.log("In heartbeat:",getState()["clientHeartbeat"]);
                updateState({"clientHeartbeat": Date.now()});
                stateToProps();
                updateView();
                alive ? setTimeout(heartbeat, 1000) : null ;
            }, 1000); // initial delay 

           // called on "mount" and before render if 2nd arg permits
           console.log("In useEffect after setInterval set");

           // called on "dismount" and after render if 2nd arg permits
           return function(){
               console.log("In useEffect post function.");
               clearInterval(interval);
           }
       }, [alive]);  // adding this prevents calling each ReactDOM.render()

    // props set i previous update pass called from heartbeat
    const clientHeartbeatStr = getProp("app","clientHeartbeat");
    const clientFsmStateStr = getProp("app","clientFsmState"); 
    console.log("In App before return.");
    return (
        <React.Fragment>
            <ReactTitle title="Sparkline" />
            <div>Client Heartbeat Status: {clientHeartbeatStr}</div>
            <div>Client FSM state is: {clientFsmStateStr} </div>
            <ReactCli/>
            <div id="meterlist">
            </div>
        </React.Fragment>
    ); 
            //<InputComponent.React />
}

class ReactTitle extends React.Component {
  render() {
    return <h1>{this.props.title} </h1>;
  }
}

// Nom rendering: think when and where, not what.
// what is obtained through 
class ReactCli extends React.Component {
  cli = Cli(handleInput);
  render() {
    return this.cli.renderReact();
  }
}

customElements.define("component-cli", ReactCli);

function cliUpdate(){
    alert("cliUpdate called");
    const statusStr = getState()["clientHeartbeat"];
    updateComponents({"app":{heartbeatStatus:statusStr}});
}


// "when and where, not what
function Cli(update=cliUpdate, id="cli", parentId="cli-container") {

    let cliText = "Initial Cli.cliText";

    function setCliText(text="enter start") {
        cliText=text;
    };

/*
    function handleSubmit(evt) {
        evt.preventDefault(); 
        update(input.value);
        //alert(input.value);
        input.value = "";
    }
*/

    function handleChange(e) {
        setCliText(e.target.value);
    }
    // parent is HTMLElement
    // parent.append(cli);

    // if parent is parentId and you need to look it up
    //document.getElementById(parentId).append(cliForm);
    return {
        update:update,
        render: function (){ return null;},
        renderReact: function () {
            return (
            <form
                style={{ marginBottom: 0 }}
                onSubmit={handleSubmit}        
            >
                <input 
                    type="text"
                    value={this.cliText}
                    onChange={handleChange}
                />
                <button>Submit</button>
            </form>);
        },
 
        renderReact2: function () { 
            return React.createElement(
                "div",
                null,
                "Cli component"
            );
        },
        status:"cli status on cli component object"
    }

    function handleSubmit(e) {

        e.preventDefault();

        const query = handleInput(cliText);
        
        if (cliText.length === 0) {
            alert("Please, enter your query.");
            return;
        }

        handleGetData(query);

        setCliText("");
    }

}

function Button({ job }) {
    return (
        <button
            id={job.channel}
            onClick={ () => handleClick(job) }
        >
            {
                !getModel().channels.find(
                    ({channel}) => channel === job.channel
                ).on ? "Turn On" : "Turn Off"
            }
        </button>
    );
}

console.log("model: ", getModel());


function Meter({ job }){
    const data = JSON.parse(job.rb).d;

    return (
        <React.Fragment>
            <div>Meter for channel: {job.channel}</div>
            <div id={job.channel}>{data.map(createGraphNode)}</div>
        </React.Fragment> 
    );
}

function createMeterButtonPair(job) {
    return (
        <React.Fragment>
            <Meter job={job} />
            <Button job={job} />
        </React.Fragment>
    );
}
