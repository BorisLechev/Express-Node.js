const fs = require('fs');
const path = require('path');
const url = require('url');

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname;

  let filePath = path.normalize(path.join(__dirname, '../views/home.html'));

  if (req.pathname === '/' & req.method === 'GET') {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      res.write(data);
      res.end();
    });
  } else {
    return true;
  }
};