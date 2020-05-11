const mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    bookName: String,
    userName: String,
    userId: String,
    borrowedId: String,
    isCompleted: String
});

module.exports = Transaction = mongoose.model('trans', transactionSchema, 'trans');