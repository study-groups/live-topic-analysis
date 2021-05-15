
function randBetween(min, max) {
    const range = max - min;
    return min + range * Math.random();
}

function sparkline(container, data, options) {

    const defaults = {
        scale: {
            x: d3.scaleLinear(),
            y: d3.scaleLinear()
        },
        size: [100, 40],
        style: {
            stroke: "rgb(60, 120, 240)",
            strokeWidth: 1
        },
        value: {
            x: d => d[0],
            y: d => d[1]
        }
    };

    options = Object.assign({}, defaults, options);

    const svg = d3.select(container)
        .append("svg")
        .classed("sparkline", true)
        .classed("sparkline-svg", true)
        .attr("width", options.size[0])
        .attr("height", options.size[1]);

    const g = svg.append("g")
        .classed("sparkline", true)
        .classed("sparkline-group", true);

    const xScale = options.scale.x
        .range([0, options.size[0]])
        .domain(d3.extent(data, options.value.x));

    const yScale = options.scale.y
        .range([options.size[1], 0])
        .domain(d3.extent(data, options.value.y));
    
    const line = d3.line()
        .x(d => xScale(options.value.x(d)))
        .y(d => yScale(options.value.y(d)));

    const path = g.append("path")
        .classed("sparkline", true)
        .classed("sparkline-path", true)
        .datum(data)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", options.style.stroke)
        .style("stroke-width", options.style.strokeWidth);
    
    return path;
}

// Set constants that will be used
const duration = 30;
const myData = [];
const now = Date.now();

const myContainer = document.getElementById("sparkline-container");

const myOptions = {
    //size: [100, 20],
    size: [500, 200],
    value: {
        x: d => d.date,
        y: d => d.value
    }
};

for (let i = duration; i > 0; i--) {
    myData.push({
        date: new Date(now - (i * 24 * 60 * 60 * 1000)),
        value: randBetween(10, 20)
    });
}

sparkline(myContainer, myData, myOptions);
