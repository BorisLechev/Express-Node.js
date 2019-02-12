const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/users/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/users/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/users/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/users/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/users/login', restrictedPages.isAnonymous, controllers.user.loginPost);
    app.get("/users/profile", restrictedPages.isAuthed, controllers.user.profile);
    app.post("/users/leaveTeam/:id", restrictedPages.isAuthed, controllers.user.leaveTeam);
    app.get("/users/searchTeams", restrictedPages.isAuthed, controllers.team.searchTeams);
    app.get("/users/searchProjects", restrictedPages.isAuthed, controllers.project.searchProjects);

    app.get("/teams/createTeam", restrictedPages.hasRole("Admin"), controllers.team.createTeamGet);
    app.post("/teams/createTeam", restrictedPages.hasRole("Admin"), controllers.team.createTeamPost);
    app.get("/teams/adminTeams", restrictedPages.hasRole("Admin"), controllers.team.adminTeamsGet);
    app.post("/teams/adminTeams", restrictedPages.hasRole("Admin"), controllers.team.adminTeamsPost);
    app.get("/teams/userTeams", restrictedPages.isAuthed, controllers.team.userTeams);

    app.get("/projects/createProject", restrictedPages.hasRole("Admin"), controllers.project.createProjectGet);
    app.post("/projects/createProject", restrictedPages.hasRole("Admin"), controllers.project.createProjectPost);
    app.get("/projects/adminProjects", restrictedPages.hasRole("Admin"), controllers.project.adminProjectsGet);
    app.post("/projects/adminProjects", restrictedPages.hasRole("Admin"), controllers.project.adminProjectsPost);
    app.get("/projects/userProjects", restrictedPages.isAuthed, controllers.project.userProjects);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};