const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        // validate: [validator, "Users must be 2."]
    }],
    dateCreated: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    }
});

// function validator(val) {
//     return val.length === 2;
// }

module.exports = mongoose.model("Thread", threadSchema);