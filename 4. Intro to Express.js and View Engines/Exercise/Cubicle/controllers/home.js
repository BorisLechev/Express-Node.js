const Cube = require("../models/Cube");

function handleQueryErrors(from, to) {
    let errors = [];

    if (!from || !to) {
        errors.push("Please, fill all difficulties.");
    }

    if (from < 1 || from > 6) {
        errors.push("From must be between 1 and 6.");
    }

    if (to < 1 || to > 6) {
        errors.push("To must be between 1 and 6.");
    }

    if (from > to) {
        errors.push("From must be less than to.");
    }

    return errors;
}

module.exports = {
    homeGet: (req, res) => {
        Cube.find() // display cubes from database
            .select("_id name imageUrl difficulty") // without select will return all properties
            .sort("-difficulty") // in descending order by difficulty
            .then((cubes) => {
                res.render("index", { // index.hbs
                    cubes // in object (context) to display cube pictures in home
                });
            })
            .catch((e) => console.log(e));
    },
    about: (req, res) => {
        res.render("about");
    },
    search: async (req, res) => {
        let {
            name,
            from,
            to
        } = req.query; // search fields  querystring
        from = +from;
        to = +to;

        let errors = handleQueryErrors(from, to);

        if (errors.length > 0) {
            res.locals.globalErrors = handleQueryErrors(from, to);

            try {
                const cubes = await Cube.find(); // да зареди index страницата с всички кубчета, но да изкара грешките
                res.render("index", {
                    cubes
                });
                return;
            } catch (err) {
                console.log(err);
            }
        }
        
        if (name && from && to) { // ako и трите са дефинирани
            Cube.find()
                .where("difficulty")
                .gte(from) // >= from
                .lte(to) // <= to
                .then((cubes) => {
                    cubes = cubes // казва се cubes, защото е cubes в index.hbs {{#each cubes}}
                        .filter(c => c.name.toLowerCase().includes(name.toLowerCase())); // дали cube съдържа c

                    res.render("index", {
                        cubes
                    });
                })
                .catch((e) => console.log(e));
        }
    }
};