const Thread = require("../models/Thread");

module.exports = {
    index: async (req, res) => {
        try {
            if (req.user) {
                if (req.user.roles.indexOf("Admin") !== -1) { // to take usernames for index.js
                    let threads = await Thread.find().populate("users"); // for logged in Admin to show registered usernames

                    res.render('home/index', {
                        threads
                    });
                } else {
                    res.render('home/index');
                }
            } else {
                res.render('home/index');
            }
        } catch (err) {
            console.error();
        }
    }
};