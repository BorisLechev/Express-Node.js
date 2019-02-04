const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    days: {
        type: Schema.Types.Number,
        required: true
    },
    car: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Car"
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

module.exports = mongoose.model("Rent", rentSchema);