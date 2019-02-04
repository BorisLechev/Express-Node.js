const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('mongoose').model('User');

module.exports = () => {
    passport.use(new LocalPassport((username, password, done) => { // done (callback) if authentication is succes
        User.findOne({
            username: username  // or mail
        }).then(user => {
            if (!user) return done(null, false);  // if user is wrong -> serialize is not successful
            if (!user.authenticate(password)) return done(null, false); // wrong password

            return done(null, user); // successful send user to session
        });
    }));

    passport.serializeUser((user, done) => { // after successful authentication will create our cookie with id and minimize
        if (user) return done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            if (!user) return done(null, false);

            return done(null, user);
        });
    });
};