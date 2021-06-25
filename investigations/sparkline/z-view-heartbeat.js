// VIEW
function Node(props) {
    return <span> {props.data} </span>;
}

function createGraphNode(json, i) {
    if (json) {
        const { data, id, type } = json;
        return <Node data={data} key={id} />;
    }
    return <Node data={0} key={i} />;
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

function App() {
    
    const heartbeat = JSON.parse(getModel().heartbeat);

    useEffect(function() {
        const interval = setInterval(function() {
            if(getModel().stateId==gStates.RUNNING) {
                handleGetData("?action=start");
            }             
        },
            1000
        );

        return () => clearInterval(interval);

    }, []);

    const appChannel = getModel().channels[0];
    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <HeartbeatStatus { ...getModel().heartbeatCli } heartbeat={heartbeat}/>
            <Form />
            <StatusMessage />
            <br />
            <Meter job={ appChannel } />
            <br />
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
