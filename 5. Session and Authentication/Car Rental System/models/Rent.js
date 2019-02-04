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
    user: {                         // with User.js rents to know the user who rented the car
        type: Schema.Types.ObjectId, // double connection REMEMBER One teacher -> many students
        required: true,               // one student -> many teachers
        ref: "User"
    }
});

module.exports = mongoose.model("Rent", rentSchema);