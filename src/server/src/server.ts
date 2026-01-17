import * as http from "http";
import config from "./config.json";
console.log("Starting server...");

function gracefulShutdown() {
    console.log("Shutdown signal received. Closing server...");
    process.exit(0);
}

// Ctrl + C
process.on("SIGINT", gracefulShutdown);

// Server Setup
const server = http.createServer((request, response) => {
    const method = request.method;
    const url = request.url;
    const test = process.env["TEST"];
    const origin = request.headers.origin;

    // bounce back response
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(`Hello World!
${method}
${url}
${origin}
${test || ""}

`);
    response.end();
});

//
// Start Listening on port
//
const port = process.env.PORT || config.port;

console.log(`Server is listening on port ${port}`);

server.listen(port);
