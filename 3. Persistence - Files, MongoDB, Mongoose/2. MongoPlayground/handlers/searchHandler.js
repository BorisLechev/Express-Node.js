const Image = require("mongoose").model("Image");
const Tag = require("mongoose").model("Tag");
const path = require("path");
const fs = require("fs");
const url = require("url");

module.exports = (req, res) => {
  if (req.pathname === '/search') {
    fs.readFile("./views/results.html", 'utf8', (err, html) => {
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/html"
        });

        res.write("404 Page not found");
        console.log(err);
        res.end();

        return;
      }

      const params = {};

      if (req.pathquery.afterDate) {}
      if (req.pathquery.beforeDate) {}
      if (req.pathquery.Limit) {}

      if (req.pathquery.tagName) {
        const tags = req.pathquery.tagName.split(",").filter(e => e.length > 0);

        if (tags.length > 0) {
          Tag.find({
            name: {
              $in: tags
            }
          }).then(data => {
            const tagsIds = data.map(m => m._id);
            params.tags = tagsIds;
            getImagesAndRespond(params);
          });
        } // } else {
        //   getImagesAndRespond(params);
        // }
      } else {
        Image.find({}).then(data => {
          let imageHtml = "";

          data.forEach((image) => {
            imageHtml += imageTemplate(image);
          });

          html = html.replace(`<div class="replaceMe"></div>`, imageHtml);

          res.writeHead(200, {
            "Content-Type": "text/html"
          });

          res.write(html);
          res.end();
        });
      }

      function getImagesAndRespond(params) {
        Image.find(params).then(data => {
          let imageHtml = "";

          data.forEach((image) => {
            imageHtml += imageTemplate(image);
          });

          html = html.replace(`<div class="replaceMe"></div>`, imageHtml);

          res.writeHead(200, {
            "Content-Type": "text/html"
          });

          res.write(html);
          res.end();
        });
      }
    });
  } else {
    return true;
  }
};

function imageTemplate(image) {
  return `<fieldset id="${image._id}"> 
  <img src="${image.url}">
  </img><p>${image.description}<p/>
  <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete
  </button> 
  </fieldset>`;
}