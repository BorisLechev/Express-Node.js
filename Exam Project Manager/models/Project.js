const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 50
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }
});

module.exports = mongoose.model("Project", projectSchema);