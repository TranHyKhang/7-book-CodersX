const mongoose = require('mongoose');

var businessSchema = mongoose.Schema({
    businessId: String,
    bookName: String,
    bookCover: String,
    bookDescription: String
});

module.exports = Business = mongoose.model('Business', businessSchema, 'Business');