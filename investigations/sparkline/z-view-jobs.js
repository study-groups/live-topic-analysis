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

    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <Meter job={ getModel().jobA } />
            <Button job={ getModel().jobA } />
            <Meter job={ getModel().jobB } />
            <Button job={ getModel().jobB } />
        </React.Fragment>
    );
}

function Button({ job }) {

    return (
        <button
            id={job.name}
            onClick={ () => handleClick(job) }
        >
            {
                !getModel()[job.name].on ? "Turn On" : "Turn Off"
            }
        </button>
    );
}

console.log("model: ", getModel());

function Meter({ job }){

    useEffect(function() {

        const interval = setInterval(function() {
            if(getModel()[job.name].on) {
                handleGetData(getModel()[job.name]);
            }             
        },
            1000
        );

        return () => clearInterval(interval);

    }, []);

    const data = JSON.parse(job.rb).d;
    console.log("job in Meter: ", job)
    return (
        <React.Fragment>
            <div>Meter {job.name}</div>
            <div id={job.name}>{data.map(createGraphNode)}</div>
        </React.Fragment> 
    );
}
