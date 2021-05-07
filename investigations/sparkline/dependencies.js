// DEPENDENCIES
// "http://$SPARKLINE_IP:$HTTP_PORT/json"
const DATA_SERVER_URL = "http://165.227.30.170:$HTTP_PORT/json";
const { useEffect } = React;
const { 
    range, 
    select,
    scaleLinear 
} = d3;
