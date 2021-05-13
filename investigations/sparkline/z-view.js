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
            if(getModel().isStreamOn) {
                handleGetData();
            }             
        },
            1000
        );

        return () => clearInterval(interval);

    }, []);

    // we can map the new real-time, global space, incoming ring buffer 
    // with the display only model.graph.props
    return (
        <React.Fragment>
            <h1>Sparkline</h1>
            <Meter/>
            <button
                onClick={ handleClick }
            >
                { !getModel().isStreamOn ? "Turn stream on" : "Turn stream off" }
            </button>
        </React.Fragment>
    );
}

console.log("model: ", getModel());

// Instead of getting data, have node array passed in.
// E.g. <Meter getModel().meter.nodes >
// <div id="meter">{data.map(createGraphNode)}</div>
function Meter(){
    return (
        <React.Fragment>
            <div id="meter">{getModel().data.map(createGraphNode)}</div>
        </React.Fragment> 
    );
}

//ReactDOM.render(<App isStreamOn={getModel().isStreamOn} />, MOUNT_POINT);
updateView();

