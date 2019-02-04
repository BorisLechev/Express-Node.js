const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carShema = new Schema({
    model: { // check names of the fields in .hbs files
        type: Schema.Types.String,
        required: true
    },
    imageUrl: {
        type: Schema.Types.String,
        required: true
    },
    pricePerDay: {
        type: Schema.Types.Number,
        required: true
    },
    isRented: {
        type: Schema.Types.Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("Car", carShema);