// VIEW
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

function App() {
 
    useEffect(function() {
        const interval = setInterval(function() {
            // use updateState (uses setObject) to avoid updateView in View
            updateState({"clientHeartbeat": Date.now()});
            setModel({
                ...getModel(),
                clientHeartbeatStatus: getState()["clientHeartbeat"]
            });
           // if(getModel().stateId === gStates.RUNNING) {
           //     handleGetData("?action=start");
           // }
        },
            1000
        );

        return () => clearInterval(interval);
        
    }, []);

    const state = enumToKeyState(getModel().stateId)
    const clientHeartbeatStatus = getModel()["clientHeartbeatStatus"];
    
    const channels = JSON.parse(
        getModel()["channels"]
    ).d.filter(item => item !== null);
    
    const content = channels.map(createJobBoard);

    console.log({channels});
    console.log({content});
    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <div>Client Heartbeat Status: {clientHeartbeatStatus}</div>
            <div>Client FSM state is: {state} </div>
            <Form />
            <div>CLI status: </div>
            <br />
            <div>{content.length ? content : null}</div>
        </React.Fragment>
    );
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

function Form() {
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
