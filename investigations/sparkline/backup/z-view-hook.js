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
    useEffect(function() {
        const interval = setInterval(function() {
            if(getModel()["app"].on) {
                handleGetData();
            }             
        },
            1000
        );

        return () => clearInterval(interval);

    }, []);

    const channels = () => Object.keys(
        getModel()
    ).filter(
        name => name !== "app"
    ).map(
        channel => getModel()[channel]
    ).map(createMeters);

    console.log("channels: ", channels)

    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <Meter job={ getModel().app } />
            <Button job={ getModel().app } />
            <br />
            {channels()}
            <Form />
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
        alert("send command: " + cliText);
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
                !getModel()[job.channel].on ? "Turn On" : "Turn Off"
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
            <br />
        </React.Fragment> 
    );
}

function createMeters(job) {
    return (
        <React.Fragment>
            <Meter job={job} />
            <Button job={job} />
        </React.Fragment>
    );
}
