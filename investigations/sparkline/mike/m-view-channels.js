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

function App() {
    const appChannel = getModel().channels[0];
    return (
        <React.Fragment>
            <h1>Sparkline</h1>
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

// deprecated
function channelsApp() {
    // App is always at index 0 and others are added thereafter.
    useEffect(function() {
        const interval = setInterval(function() {
            if(getModel().channels[0].on) {
                handleGetData();
            }             
        },
            1000
        );

        return () => clearInterval(interval);

    }, []);

    const appChannel = getModel().channels[0];
    const otherChannels = () => getModel().channels
        .slice(1) // skip index 0 where app is
        .map(createMeterButtonPair); // map data to other meters and buttons

    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <Form />
            <StatusMessage />
            <Meter job={ appChannel } />
            <Button job={ appChannel } />
            <br />
            {otherChannels()}
        </React.Fragment>
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
