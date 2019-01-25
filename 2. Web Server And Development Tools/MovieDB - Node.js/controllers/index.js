//файл - буфер

const homeController = require('./home-controller');
const staticFilesController = require('./static-files-controller');
const viewAllMoviesController = require('./view-all-controller');

module.exports = [
  homeController,
  staticFilesController,
  viewAllMoviesController
];