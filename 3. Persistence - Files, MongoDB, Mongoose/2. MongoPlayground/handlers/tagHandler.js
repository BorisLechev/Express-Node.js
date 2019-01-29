const formidable = require("formidable"); // за разбота с форми
const Tag = require("mongoose").model("Tag");
const util = require("util");

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') { // generateTag is form action=...
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }

      res.writeHead(200, {
        "Content-Type": "text/plain" // създаваме <div> за таговете, затова е text/plain
      });

      const name = fields.tagName;

      Tag.create({
        name,
        images: []
      }).then(() => {
        res.writeHead(302, {
          location: "/" // home page
        });

        res.end();
      }).catch(err => {
        res.writeHead(500, {
          "Content-Type": "text/plain"
        });

        res.write("500 Internal Server Error");
        res.end();
      });
    });
  } else {
    return true;
  }
};