const error = require("../index");
const fs = require("fs");
const path = require("path");
const url = require("url");
const qs = require("querystring");
const formidable = require("formidable");
let db = require("../db/db");
const shortid = require("shortid");

function viewAll(req, res) {
  fs.readFile("./views/viewAll.html", "utf8", (err, data) => {
    if (err) {
      error.displayError(err);
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    db = db.sort((a, b) => {
      return b.dateStamp - a.dateStamp;
    });

    let viewAllHtml = "";

    db.forEach(meme => {
      if (meme.privacy === 'on') {
        viewAllHtml += viewAllTemplate(meme);
      }
    });

    data = data.replace(`<div id="replaceMe">{{replaceMe}}</div>`, viewAllHtml);

    res.write(data);
    res.end();
  });
}

function getDetails(req, res) {
  fs.readFile("./views/details.html", "utf8", (err, data) => {
    if (err) {
      error.displayError(err);
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    let detailsHtml = "";
    let id = qs.parse(url.parse(req.url).query).id;

    db.forEach(meme => {
      if (meme.id === id) {
        detailsHtml += detailsTemplate(meme);
      }
    });

    data = data.replace(`<div id="replaceMe">{{replaceMe}}</div>`, detailsHtml);

    res.write(data);
    res.end();
  });
}

function viewAddMeme(req, res) {
  fs.readFile("./views/addMeme.html", "utf8", (err, data) => {
    if (err) {
      error.displayError(err);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.write(data);
    res.end();
  });
}

function addMeme(req, res) {
  let form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (err) {
      res.error(err);
      return;
    }

    let id = shortid.generate();
    let fileName = `./public/memeStorage/${id}.jpg`;

    let temp_path = files.meme.path;

    meme = {
      "id": id,
      "title": fields.memeTitle,
      "memeSrc": fileName,
      "description": fields.description,
      "privacy": fields.status,
      "dateStamp": +new Date()
    };

    fs.copyFile(temp_path, fileName, function (err) {
      if (err) {
        console.error(err);
        return;
      }
    });

    db.push(meme);
    db.save();
    viewAll(req, res);
    return;
  });
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res);
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res);
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res);
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res);
  } else if (req.pathname.startsWith('public/memeStorage') && req.method === 'GET') {
    console.log('HERE');
  } else {
    return true;
  }
};

function viewAllTemplate(meme) {
  return `<div class="${meme}">
  <a href="/getDetails?id=${meme.id}">
  <img class="memePoster" src="${meme.memeSrc}"/>          
</div>`;
}

function detailsTemplate(meme) {
  return `<div class="content">
  <img src="${meme.memeSrc}" alt=""/>
  <h3>Title ${meme.title}</h3>
  <p> ${meme.description}</p>
</div>`;
}