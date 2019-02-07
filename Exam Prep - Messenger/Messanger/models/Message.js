const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const messageSchema = new mongoose.Schema({
    content: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId, // chat between 2 users
        required: true,
        ref: "Thread"
    }
});

module.exports = mongoose.model("Message", messageSchema);