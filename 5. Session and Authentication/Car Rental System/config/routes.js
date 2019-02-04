const restrictedPages = require('./auth'); // if you are logged in already you cannot login in again (middleware)
const homeController = require('../controllers/home');
const userController = require("../controllers/user");
const carController = require("../controllers/car");

module.exports = app => {
    app.get('/', homeController.index);
    app.get("/user/register", restrictedPages.isAnonymous, userController.registerGet); // if we are authenticated redirect to home
    app.post("/user/register", restrictedPages.isAnonymous, userController.registerPost);
    app.get("/user/login", restrictedPages.isAnonymous, userController.loginGet);
    app.post("/user/login", restrictedPages.isAnonymous, userController.loginPost);
    app.post("/user/logout", userController.logout);
    app.get("/user/rents/:id", restrictedPages.isAuthed, userController.myRents); // only for registered users

    app.get("/car/add", restrictedPages.hasRole("Admin"), carController.addGet); // block path for admins
    app.post("/car/add", restrictedPages.hasRole("Admin"), carController.addPost);
    app.get("/car/all", carController.allCars); // should be available for all that's why there is no middleware
    app.get("/car/rent/:id", restrictedPages.isAuthed, carController.rentGet); // only for registered users after we click rent car will disappear
    app.post("/car/rent/:id", restrictedPages.isAuthed, carController.rentPost); // only for registered users after we click rent car will disappear
    app.get("/car/edit/:id", restrictedPages.hasRole("Admin"), carController.editGet); //only for admins
    app.post("/car/edit/:id", restrictedPages.hasRole("Admin"), carController.editPost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};