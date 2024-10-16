const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

// port can be provided in an environment variable, by default we will use 3000
const PORT = process.env.PORT || 3000;

// common MIME types
// source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const MIME_TYPES = {
    ".css": "text/css",
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".svg": "image/svg+xml",
};

// map vendor files with node_modules 
const VENDOR_FILES = {
    "/codecake.js": "node_modules/codecake/codecake.js",
    "/codecake.css": "node_modules/codecake/codecake.css",
    "/low.css": "low.css",
    "/sprite.svg": "node_modules/@josemi-icons/svg/sprite.svg",
};

// tiny method to get the MIME type using the extension
const lookup = file => {
    return MIME_TYPES[path.extname(file)] || "text/plain";
};

// server main function
const serve = () => {
    // send file as a response
    const sendFile = (res, filePath) => {
        const pathExists = fs.existsSync(filePath);
        // 1. File exists: send file with the correct MIME type
        if (pathExists) {
            res.writeHead(200, {
                "Content-Type": lookup(path.basename(filePath)),
            });
            fs.createReadStream(filePath).pipe(res);
        }
        // 2. File does not exist: send a 404 message
        else {
            res.writeHead(404);
            res.end("Not found");
        }
    };
    const server = http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`);
        const url = path.normalize(req.url);
        // Check for index.html or '/'
        if (url === "/" || url === "/index.html") {
            return sendFile(res, path.join(process.cwd(), "playground.html"));
        }
        // check for a vendor file
        else if (VENDOR_FILES[url]) {
            return sendFile(res, path.join(process.cwd(), VENDOR_FILES[url]));
        }
        // send requested file
        sendFile(res, path.join(process.cwd(), url));
    });
    // launch server
    server.listen(PORT);
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
};

// run serve or build
serve();
