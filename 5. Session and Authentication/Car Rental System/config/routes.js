const restrictedPages = require('./auth'); // if you are logged in already you cannot login in again (middleware)
const controllers = require("../controllers/index");

module.exports = app => {
    app.get('/', controllers.homeController.index);
    app.get("/user/register", restrictedPages.isAnonymous, controllers.userController.registerGet); // if we are authenticated redirect to home
    app.post("/user/register", restrictedPages.isAnonymous, controllers.userController.registerPost);
    app.get("/user/login", restrictedPages.isAnonymous, controllers.userController.loginGet);
    app.post("/user/login", restrictedPages.isAnonymous, controllers.userController.loginPost);
    app.post("/user/logout", controllers.userController.logout);
    app.get("/user/rents", restrictedPages.isAuthed, controllers.userController.myRents); // only for registered users

    app.get("/car/add", restrictedPages.hasRole("Admin"), controllers.carController.addGet); // block path for admins
    app.post("/car/add", restrictedPages.hasRole("Admin"), controllers.carController.addPost);
    app.get("/car/all", controllers.carController.allCars); // should be available for all that's why there is no middleware
    app.get("/car/rent/:id", restrictedPages.isAuthed, controllers.carController.rentGet); // only for registered users after we click rent car will disappear
    app.post("/car/rent/:id", restrictedPages.isAuthed, controllers.carController.rentPost); // only for registered users after we click rent car will disappear
    app.get("/car/edit/:id", restrictedPages.hasRole("Admin"), controllers.carController.editGet); //only for admins
    app.post("/car/edit/:id", restrictedPages.hasRole("Admin"), controllers.carController.editPost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};