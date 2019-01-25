const http = require('http');
const controllers = require('./controllers');
const port = 8080;

http
  .createServer((req, res) => {
    for (let controller of controllers) {
      if (!controller(req, res)) {
        break;
      }
    }
  })
  .listen(port, () => {
    console.log(`Our server is on port: ${port}`);
  });