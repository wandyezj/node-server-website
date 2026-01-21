import * as http from "http";
import config from "./config.json";
console.log("Starting server...");

function gracefulShutdown() {
    console.log("Shutdown signal received. Closing server...");
    process.exit(0);
}

// Ctrl + C
process.on("SIGINT", gracefulShutdown);

type FunctionRequestMatcher = (request: http.IncomingMessage) => boolean;

type FunctionRequestHandler = (
    request: http.IncomingMessage,
    response: http.ServerResponse
) => void;

function getMatcher(match: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
    url: string;
    origin?: string;
}): FunctionRequestMatcher {

    function matches(matchValue: string | undefined, requestValue: string | undefined): boolean {
        if (!matchValue) {
            return true; // If matcher is undefined, it matches anything
        }

        if (matchValue === requestValue) {
            return true; // Exact match
        }

        return false; // No match
    }

    function matcher(request: http.IncomingMessage): boolean {
        // Match then request
        return matches(match.method, request.method) &&
            matches(match.url, request.url) &&
            matches(match.origin, request.headers.origin);
    }

    return matcher;
}




const registry: [FunctionRequestMatcher, FunctionRequestHandler][] = [
    [
        // Ping
        getMatcher({ method: "GET", url: "/ping" }),
        (request, response) => {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write("pong");
            response.end();
        }
    ],
];

function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {

    for (const [matcher, handler] of registry) {
        if (matcher(request)) {
            console.log(`Matched request: ${request.method} ${request.url}`);
            handler(request, response);
            return; // Stop processing after the first match
        }
    }

    // Default handler if no match found
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("Not Found");
    response.end();

}

// Server Setup
const server = http.createServer((request, response) => {
    const method = request.method;
    const url = request.url;
    //const test = process.env["TEST"];
    const origin = request.headers.origin;

    console.log(`Received request: ${method} ${url} from ${origin}`);

    try {

        handleRequest(request, response);
    } catch (error) {
        console.error("Error handling request:", error);
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write("Internal Server Error");
        response.end();
    }
});

//
// Start Listening on port
//
const port = process.env.PORT || config.port;

console.log(`Server is listening on port ${port}`);

server.listen(port);
