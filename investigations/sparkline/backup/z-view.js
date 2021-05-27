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

function Meter(){
    return (
        <React.Fragment>
            <div id="meter">{getModel().data.map(createGraphNode)}</div>
            <div id="meter2">{getModel().data2}</div>
        </React.Fragment> 
    );
}

function LineChart() {


    useEffect(() => {
        update();               
    }, [getModel().lineGraph]);
    
    function update() {
        const chartComponentSelection = select("#sparkline-container");
        
        if (chartComponentSelection.empty()) {
            return;
        }

        const mainSvgSelection = select("svg");
        
        if (!mainSvgSelection.empty()) {
            mainSvgSelection.remove();
        }

        const lineGraphContainer = document.getElementById(
            "sparkline-container"
        );

        const options = {
            size: [500, 200],
            value: {
                x: d => d.date,
                y: d => d.value
            }
        };

        sparkline(lineGraphContainer, getModel().lineGraph, options);
        
    }
}
