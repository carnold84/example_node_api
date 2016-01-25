var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/admin_api');

// create instance of Schema
var mongoSchema = mongoose.Schema;

// create schema
var projectsSchema  = {
    "title" : String,
    "description" : String
};

// create model if not exists.
module.exports = mongoose.model('projects', projectsSchema);