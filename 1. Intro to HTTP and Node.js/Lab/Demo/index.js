const http = require("http");

const port = 8080;

http
    .createServer((req, res) => {
        res.write("Hello world.");
        res.end();
    })
    .listen(port);

console.log(`Web Server started at port ${port}`);