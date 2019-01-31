const Cube = require("../models/Cube");

function handleErrors(err, res, cubeBody) { // cubeBody след грешка да не се трият input полетата в Create
    let errors = [];

    for (const prop in err.errors) {
        errors.push(err.errors[prop].message);
    }

    res.locals.globalErrors = errors;
    res.render("cube/create", cubeBody); //cubeBody след грешка да не се трият input полетата в Create
}

module.exports = {
    createGet: (req, res) => {
        res.render("cube/create");
    },
    createPost: (req, res) => {
        const cubeBody = req.body; // create page input fields
        cubeBody.difficulty = +cubeBody.difficulty; // parse to number

        Cube.create(cubeBody).then((c) => {
                res.redirect("/");
            })
            .catch((err) => handleErrors(err, res, cubeBody));
    },
    details: (req, res) => {
        const id = req.params.id; // id for specific cube details from routes.js

        Cube.findById(id)
            .then((cube) => {
                res.render("cube/details", cube);
            })
            .catch((e) => handleErrors(err, res, cubeBody));
    }
};