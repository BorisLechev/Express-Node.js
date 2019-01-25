const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');
const formidable = require('formidable');
const db = require('../config/dataBase');

module.exports = (req, res) => {

  req.pathname = req.pathname || url.parse(req.url).pathname;

  if (req.pathname === '/viewAllMovies' && req.method === 'GET') {

    let filePath = path.normalize(path.join(__dirname, '../views/viewAll.html'));

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      db.map((m, i) => {
        m.id = i;

        return m;
      }).sort((a, b) => a.movieYear - b.movieYear);

      let movies = '';

      for (let movie of db) {
        movies +=
        `<div class="movie">
          <a href="/movies/details/${movie.id}">
            <img class="moviePoster" src="${decodeURIComponent(movie.moviePoster)}"/>
          </a>
        </div>`;
      }

      data = data.toString().replace('{{replaceMe}}', movies);

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      res.write(data);
      res.end();
    });
  } else if (req.pathname === '/addMovie' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/addMovie.html'));

    fs.readFile(filePath, 'utf8', (err, data) => {
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
  } else if (req.pathname === '/addMovie' && req.method === 'POST') {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, movieData, files) => {
      if (err) {
        console.log(err);
        return;
      }

      let message = '';

      if (movieData.movieTitle === '' || movieData.moviePoster === '') {
        let failPath = path.normalize(path.join(__dirname, '../views/addMovie.html'));

        fs.readFile(failPath, (err, data) => {
          if (err) {
            console.log(err);
            return;
          }

          let errorMsg = '<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>';
          data = data.toString().replace('{{replaceMe}}', errorMsg);

          res.writeHead(400, {
            'Content-Type': 'text/html'
          });

          res.write(data);
          res.end();
        });
      } else {
        let filePath = path.normalize(path.join(__dirname, '../views/viewAll.html'));

        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.log(err);
            return;
          }

          db.push(movieData);

          res.writeHead(302, {
            'Location': '/viewAllMovies'
          });

          res.write(data);
          res.end();
        });
      }
    });
  } else if (req.pathname.includes('/details/')) {
    let urlId = req.pathname.split('/').pop();

    if (!isNaN(urlId)) {
      let urlAsNumber = +urlId;

      db.find(movie => {
        if (movie["id"] === urlAsNumber) {

          let filePath = path.normalize(path.join(__dirname, '../views/details.html'));
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            
            let filmInfo =
              `<div class="content">
                <img src="${decodeURIComponent(movie.moviePoster)}" alt=""/>
                <h3>Title ${decodeURIComponent(movie.movieTitle)}</h3>
                <h3>Year ${decodeURIComponent(movie.movieYear)}</h3 >
                <p> ${decodeURIComponent(movie.movieDescription)}</p>
              </div >`;

            data = data.toString().replace('{{replaceMe}}', filmInfo);

            res.writeHead(200, {
              'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
          });
        }
      });
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });

      res.write('Film does not exists');
      res.end();
    }
  } else {
    return true;
  }
};