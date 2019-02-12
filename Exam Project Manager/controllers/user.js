const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Team = require("../models/Team");
const Project = require("../models/Project");

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;

        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },
    profile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            let teams = [];
            let projects = [];

            user.hasTeams = true;
            user.hasProjects = true;

            if (!user.teams.length) {
                user.hasTeams = false;
                user.hasProjects = false;

                res.render("users/profile", {
                    user
                });
                return;
            } else {
                for (const team of user.teams) {
                    let newTeam = await Team.findById(team);
                    let project = await Project.findOne({
                        team
                    });

                    if (project) {
                        projects.push(project);
                    }

                    teams.push(newTeam);
                }

                user.newTeams = teams;

                if (projects.length === 0) {
                    user.hasProjects = false;

                    res.render("users/profile", {
                        user
                    });
                    return;
                } else {
                    user.newProjects = projects;

                    res.render("users/profile", {
                        user
                    });
                    return;
                }
            }
        } catch (err) {
            console.error();
        }
    },
    leaveTeam: async (req, res) => {
        const teamId = req.params.id;
        const userId = req.user.id;

        let team = await Team.findById(teamId);

        team.members.pop(userId);
        req.user.teams.pop(teamId);
        
        await team.save();
        await req.user.save();

        res.redirect("/users/profile");
    }
};