var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    name: String,
    description: String,
    coverUrl: String
});

module.exports = Book = mongoose.model('book', bookSchema, 'books');