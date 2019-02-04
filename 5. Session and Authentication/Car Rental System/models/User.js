const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    hashedPass: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firstName: {
        type: mongoose.Schema.Types.String
    },
    lastName: {
        type: mongoose.Schema.Types.String
    },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.String
    }],
    rents:[{                             /// array of rented cars id's added for the table My Rented Cars
        type:mongoose.Schema.Types.ObjectId, // double connection REMEMBER One teacher -> many students
        ref:"Rent"                            // one student -> many teachers
    }]
});

userSchema.method({ // hashing password, add salt and check initially hashed password
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);
// TODO: Create an admin at initialization here

User.seedAdmin = async () => {
    try {
        const users = await User.find(); // all users
        if (users.length > 0) {
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, "admin123");

        return User.create({ // return Promise for chaining
            username: "Admin",
            hashedPass,
            firstName: "Peshoslav",
            lastName: "Popyordanov",
            salt,
            roles: ["Admin"]
        });
    } catch (err) {
        console.log(err);
    }

};

module.exports = User;