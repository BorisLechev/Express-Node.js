const Team = require("../models/Team");
const User = require("../models/User");

module.exports = {
    createTeamGet: (req, res) => {
        res.render(`teams/createTeam`);
    },
    createTeamPost: async (req, res) => {
        try {
            await Team.create({
                name: req.body.teamName // teamName from createTeam.hbs when fill the input
            });

            console.log(req.body.teamName);
            res.redirect("/");
        } catch (err) {
            console.error();
        }
    },
    adminTeamsGet: async (req, res) => {
        let usersArray = await User.find();
        let teamsArray = await Team.find();

        res.render("teams/adminTeams", {
            usersArray,
            teamsArray
        });
    },
    adminTeamsPost: async (req, res) => {
        try {
            const {
                userId,
                teamId
            } = req.body;

            const team = await Team.findById(teamId);

            if (team.members.indexOf(userId) !== -1) {
                console.log("Cannot add the same user twice!");
                res.locals.globalError = "Cannot add the same user twice!";

                res.redirect("/");
            } else {
                const user = await User.findById(userId);

                user.teams.push(teamId);
                await user.save();

                team.members.push(userId);
                await team.save();

                res.redirect("/");
            }
        } catch (err) {
            console.error();
        }
    },
    userTeams: async (req, res) => {
        let teams = await Team
            .find()
            .populate("projects")
            .populate("members");

        teams.forEach(team => {
            team.hasMembers = true;
            team.hasProjects = true;

            if (!team.members.length) {
                team.hasMembers = false;
            }

            if (!team.projects.length) {
                team.hasProjects = false;
            }
        });

        res.render("teams/userTeams", {
            teams
        });
    },
    searchTeams: async (req, res) => {
        let query = req.query.searchQuery;

        let teams = await Team
            .find()
            .populate('projects')
            .populate('members');

        const filteredTeams = teams.filter((p) => {
            return p.name.toLowerCase().includes(query.toLowerCase())
        });

        filteredTeams.forEach(team => {
            team.hasMembers = true;
            team.hasProjects = true;

            if (!team.members.length) {
                team.hasMembers = false;
            }

            if (!team.projects.length) {
                team.hasProjects = false;
            }
        });

        res.render('teams/userTeams', {
            teams: filteredTeams
        });
    }
};