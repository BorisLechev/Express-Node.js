const http = require('http');
const url = require('url');
const handlers = require('./handlers/handlerBlender');
const db = require('./config/dataBase');
const port = 5000;

db.load().then(() => {
  http
    .createServer((req, res) => {
      exports.displayError = (err) => {
        res.writeHead(404, {
          "Content-Type": "text/html"
        });

        res.write("404 Page Not Found");
        console.log(err);
        res.end();
      };

      for (let handler of handlers) {
        req.pathname = url.parse(req.url).pathname;
        let task = handler(req, res);

        if (task !== true) {
          break;
        }
      }
    })
    .listen(port);

  console.log(`Our server is on port: ${port}`);
}).catch(() => {
  console.log('Failed to load DB');
});