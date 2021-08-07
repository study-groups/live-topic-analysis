const http = require("http");
const fs = require("fs");
const url = require("url");
const { spawn } = require("child_process"); // neither used

// https://nodejs.org/docs/latest/api/process.html#process_process_argv
const PORT = process.argv[2] 
const HTML_PATH = process.argv[3]
const JSON_DIR = process.argv[4]
const SERVER_IP = "0.0.0.0"; // catch all network interface

const server = http.createServer( function(req, res) {
    // From https://nodejs.org/docs/guides/anatomy-of-an-http-transaction
    // The method here will always be a normal HTTP method/verb. The
    // url is the full URL without the server, protocol or port. For
    // a typical URL, this means everything after and including the
    // third forward slash. 

    // The request object is an instance of IncomingMessage.

    // parse the url
    const parsedUrl = url.parse(req.url, true);

    // path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    
    // query string as object
    const query = parsedUrl.query;

    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(HTML_PATH, function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data);
        }); 
    }
    // /json?min=0&max=20
    if (req.method === 'GET' && path === '/json') {
        res.writeHead(200, {"Content-Type": "application/json"});

        // in future call spawn and get stdio from webtool-json-hook 
        // figure out how to specify which hook to use where "/json-hook" is currently located manually  
        // req vars passed to json-hook file
        
        // random number generated between 1 and max
        //const defaultMin = query.min || 0;
        const defaultMax = query.max || 20;
        const pipeline = spawn(`${JSON_DIR}/json-hook`);
        //const pipeline = spawn(`${JSON_DIR}/json-hook`, [defaultMax]);
        //const pipeline = spawn(`${JSON_DIR}/json-hook`,
        //                       [defaultMin, defaultMax]);

        //pipeline.stdout.on("data", function(data) {
            //console.log("data to send to client: ", data.toString());
        //});

        //pipeline.stderr.on("data", (err) => console.log("Error: ", err))
        pipeline.stderr.on("data", 
            (err) => console.log("Error: ",Buffer.from(err).toString()))
        
        // pipes stdout of process to client
        pipeline.stdout.pipe(res);
    }
    
});

server.listen(PORT, SERVER_IP);
console.log(`Node application running on ${SERVER_IP}:${PORT}`);
const hostname = spawn("hostname", ["-I"]);
hostname.stdout.on("data", function(data) {
    const { HTML_PORT } = process.env;
    console.log(
        `Dashboard on IP: ${data.toString().split(" ")[0]}:${HTML_PORT}/`
    );
});
