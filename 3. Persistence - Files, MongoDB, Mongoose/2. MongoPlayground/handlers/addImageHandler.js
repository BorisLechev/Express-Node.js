const formidable = require("formidable");
const Image = require("mongoose").model("Image");
const objectId = require('mongoose').Types.ObjectId;

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res);
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res);
  } else {
    return true;
  }
};

function addImage(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err;
    }

    const url = fields.imageUrl;
    const description = fields.description;
    const title = fields.imageTitle;

    const tags = fields.tagsId.split(",").reduce((accumulator, currentValue, currentIndex, array) => {
      if (accumulator.includes(currentValue) || currentValue.length === 0) {
        return accumulator;
      } else {
        accumulator.push(currentValue);

        return accumulator;
      }
    }, []).map(objectId);

    const image = {
      url,
      title,
      description,
      tags
    };

    Image.create(image).then(image => {
      res.writeHead(302, {
        "location": "/" // home page
      });

      res.end();
    }).catch(err => {
      res.writeHead(500, {
        "Content-Type": "text/plain"
      });

      res.write("500 Internal Server Error");
      console.log(err);
      res.end();
    });
  });
}

function deleteImg(req, res) {
  Image.deleteOne({
    _id: req.pathquery.id
  }).then(() => {
    res.writeHead(302, {
      location: "/"
    });

    res.end();
  }).catch(err => {
    res.writeHead(500, {
      "Content-Type": "text/plain"
    });

    res.write("500 Internal Server Error");
    console.log(err);
    res.end();
  });
}