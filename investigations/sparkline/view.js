// VIEW
function Node(props) {
    return <span> {props.data} </span>;
}

function createGraphNode(json, i) {
    const { data, id, type } = json;
    return <Node data={data} key={id} />;
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

function Meter(){
    return (
        <React.Fragment>
            <div id="meter">{getModel().data.map(createGraphNode)}</div>
        </React.Fragment> 
    );
}

//ReactDOM.render(<App isStreamOn={getModel().isStreamOn} />, MOUNT_POINT);
updateView();
