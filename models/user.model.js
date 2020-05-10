const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    avatar: String,
    isAdmin: String
});

module.exports = User = mongoose.model("user", userSchema, 'users');

