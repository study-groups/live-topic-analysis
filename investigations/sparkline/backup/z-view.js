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

    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <Meter job={ getModel().app } />
            <Button job={ getModel().app } />
            <Meter job={ getModel()["001"] } />
            <Button job={ getModel()["001"] } />
            <Meter job={ getModel()["002"] } />
            <Button job={ getModel()["002"] } />
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

    const data = JSON.parse(job.rb).d;

    return (
        <React.Fragment>
            <div>Meter {job.name}</div>
            <div id={job.name}>{data.map(createGraphNode)}</div>
        </React.Fragment> 
    );
}
