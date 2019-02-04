const encryption = require("../util/encryption"); // for salt
const User = require("../models/User"); // UserSchema
const Rent = require("../models/Rent");

module.exports = {
    registerGet: (req, res) => {
        res.render("user/register"); // load template
    },
    registerPost: async (req, res) => {
        const userBody = req.body; // for register.hbs

        if (!userBody.username || !userBody.password || !userBody.repeatPassword) { // names of the input fields in register.hbs
            userBody.error = "Please, fill all fields."; // error from main.hbs error ??
            res.render("user/register", userBody); // load template
            return;
        }

        if (userBody.password !== userBody.repeatPassword) {
            userBody.error = "Both passwords should match!";
            res.render("user/register", userBody); // load template
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, userBody.password);

        try {
            const user = await User.create({ // UserSchema
                username: userBody.username, // username: from User.js
                hashedPass,
                salt,
                firstName: userBody.firstName,
                lastName: userBody.lastName,
                roles: ["User"]
            });

            req.logIn(user, (err) => { // send to passport.js serializeUser
                if (err) {
                    userBody.error = err;
                    res.render("user/register", userBody);
                } else {
                    res.redirect("/");
                }
            });
        } catch (err) {
            console.log(err);
        }
    },
    logout: (req, res) => {
        req.logout(); // from passport.js
        res.redirect("/");
    },
    loginGet: (req, res) => {
        res.render("user/login"); // load template
    },
    loginPost: async (req, res) => {
        const userBody = req.body;

        try {
            const user = await User.findOne({ // search by username(unique)
                username: userBody.username
            });

            if (!user) {
                userBody.error = "Username is invalid!";
                res.render("user/login", userBody);
                return;
            }

            if (!user.authenticate(userBody.password)) {
                userBody.error = "Invalid password!";
                res.render("user/login", userBody);
                return;
            }

            req.logIn(user, (err) => { // send to passport.js serializeUser
                if (err) {
                    userBody.error = err;
                    res.render("user/register", userBody);
                } else {
                    res.redirect("/");
                }
            });
        } catch (err) {
            userBody.error = "Something went wrong!";
            res.render("user/register", userBody);
        }
    },
    myRents: (req, res) => {
        const userId = req.user._id;

        Rent.find({
                user: userId
            })
            .populate("car")  // will take all data about car not only the id
            .then((cars) => {
                res.render("user/rents", {
                    cars
                });
            })
            .catch(console.error);
    }
};