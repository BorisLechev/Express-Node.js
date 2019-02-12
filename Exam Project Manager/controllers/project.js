const Project = require("../models/Project");
const Team = require("../models/Team");

module.exports = {
    createProjectGet: (req, res) => {
        res.render("projects/createProject");
    },
    createProjectPost: async (req, res) => {
        try {
            console.log('here')
            await Project.create({
                name: req.body.projectName,
                description: req.body.projectDescription
            });

            console.log(req.body.projectName);
            console.log(req.body.projectDescription);

            res.redirect(`/`);
        } catch (err) {
            console.error();
        }
    },
    adminProjectsGet: async (req, res) => {
        let teamsArray = await Team.find();
        let projectsArray = await Project.find(); // ??????????

        res.render("projects/adminProjects", {
            teamsArray,
            projectsArray
        });
    },
    adminProjectsPost: async (req, res) => {
        try {
            const {
                teamId,
                projectId
            } = req.body;

            const team = await Team.findById(teamId);
            const project = await Project.findById(projectId);

            team.projects.push(projectId);
            project.team = teamId;

            await team.save();
            await project.save();

            res.redirect("/");
        } catch (err) {
            console.error();
        }
    },
    userProjects: async (req, res) => {
        let projects = await Project
            .find()
            .populate("team");

        projects.forEach(project => {
            project.hasTeam = true;

            if (!project.team) {
                project.hasTeam = false;
            }
        });

        res.render("projects/userProjects", {
            projects
        });
    },
    searchProjects: async (req, res) => {
        let searchQuery = req.query.searchQuery;
        let projects = await Project
            .find()
            .populate('team');

        const filteredProjects = projects.filter((p) => {
            return p.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        filteredProjects.forEach(project => {
            project.hasTeam = true;

            if (!project.team) {
                project.hasTeam = false;
            }
        });

        res.render('projects/userProjects', {
            projects: filteredProjects
        });
    }
};