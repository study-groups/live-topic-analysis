
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

// VIEW
function createComponent(nom) {
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

function App() {

    useEffect(
        function() {
            const interval = setInterval(function() { 
                updateState({"clientHeartbeat": Date.now()});
            }, 1000);

           return () => clearInterval(interval);

        }, []);


    // done in the update pass
    // Cli.update();
    // const status = enumToStr(getState()["clientFsm"])

    const props = getComponent("app"); // component is a props map

    //const clientHeartbeatStatus = getModel()["clientHeartbeatStatus"];
    const clientHeartbeatStatus = getComponent("app")
                                    .heartbeatStatus;
    /* 
    const channels = JSON.parse(
        getModel()["channels"]
    ).filter(item => item !== null);
    
    const content = channels.map(createJobBoard);

            <div id="cli-container"> </div>
    */
    
    return (
        <React.Fragment>
            <ReactTitle title="Sparkline" />
            <div>Client Heartbeat Status: {clientHeartbeatStatus}</div>
            <div>Client FSM state is: {props.status} </div>
            <ReactCli />
            <div>CLI status: </div>
            <div id="meterlist">
            </div>
        </React.Fragment>
    );
}

class ReactTitle extends React.Component {
  render() {
    return <h1>{this.props.title} </h1>;
  }
}

// Nom rendering: think when and where, not what.
// what is obtained through 
class ReactCli extends React.Component {
  cli = Cli();
  render() {
    return this.cli.renderReact();
  }
}



function StatusMessage() {
    if (getModel().status === "" ) {
        return null;
    }
    if (getModel().status !== "OK") {
        return <div style={{color: "red"}}>Error {getModel().status}</div>;
    }
    return <div style={{color: "green"}}>Request successful</div>;
}

function HeartbeatCli(props) {
    const [cliText, setCliText] = useState("");

    function handleChange(e) {
        setCliText(e.target.value);
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

    return (
        <form
            style={{ marginBottom: 0 }}
            onSubmit={handleSubmit}        
        >
            <input 
                type="text"
                value={cliText}
                onChange={handleChange}
            />
            <button>Submit</button>
        </form>
    );
}

function cliUpdate(theCli){
    //theCli.status("implement this method"); 
    alert("implement this method"); 
}

// "when and where, not what
function Cli(id="cli", parentId="cli-container",update=cliUpdate) {
    const cliForm = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    
    input.placeholder = "Enter command here";
    button.textContent = "Submit";
    
    cliForm.id = id;
    cliForm.addEventListener("submit", handleSubmit);
    cliForm.append(input, button);

    function handleSubmit(evt) {
        evt.preventDefault(); 
        update(input.value);
        //alert(input.value);
        input.value = "";
    }

    // parent is HTMLElement
    // parent.append(cli);

    // if parent is parentId and you need to look it up
    //document.getElementById(parentId).append(cliForm);


    return {
        update:update,
        render: function (){ return null;},
        renderReact: function (){ 
                          return React.createElement(
                              "div",null,"<h2>is this bold</h2>");},
        status:"cli status on cli component object"
    }



    /*
    const [cliText, setCliText] = useState("");

    function handleChange(e) {
        setCliText(e.target.value);
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

    return (
        <form
            style={{ marginBottom: 0 }}
            onSubmit={handleSubmit}        
        >
            <input 
                type="text"
                value={cliText}
                onChange={handleChange}
            />
            <button>Submit</button>
        </form>
    );
    */
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
