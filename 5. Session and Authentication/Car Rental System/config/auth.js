 // Middleware

 module.exports = {
     isAuthed: (req, res, next) => {
         if (req.user) {  // if you are authenticated or admin
             next();  // -> controller
         } else {
             res.redirect('../user/login');
         }
     },
     hasRole: (role) => (req, res, next) => {
         if (req.isAuthenticated() &&
             req.user.roles.indexOf(role) > -1) {
             next();
         } else {
             res.redirect('../user/login');
         }
     },
     isAnonymous: (req, res, next) => {
         if (!req.isAuthenticated()) {
             next();
         } else {
             res.redirect('/');
         }
     }
 }