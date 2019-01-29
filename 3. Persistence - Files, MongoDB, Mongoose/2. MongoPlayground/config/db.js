const mongoose = require('mongoose');

// connectionString
module.exports = mongoose.connect("mongodb://localhost:27017/mongo-db-playground", {
    useNewUrlParser: true
});