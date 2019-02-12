const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
require('./database/database')();
const port = 3000;
const app = express();

app.use(bodyParser.json()); // requesting data in JSON format

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // everyone can send requests to my server e.g. codepen.io
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// setting up router modules
app.use('/feed', feedRoutes); // /feed/post/create always begin with feed after that feed.js in routes
app.use('/auth', authRoutes); // /auth/signup

// General error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message
  });
  next();
});

// creating an express.js app and listening to a port
app.listen(port, () => {
  console.log(`REST API listening on port: ${port}`);
});