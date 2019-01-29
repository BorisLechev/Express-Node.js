const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    creationDate: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now,
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }]
});

module.exports = mongoose.model("Tag", tagSchema);