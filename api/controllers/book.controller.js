const Book = require('../../models/book.model');

module.exports.index = async(req, res) => {
    var books = await Book.find();
    res.json(books);
}

module.exports.delete = async(req, res) => {
    var bookDel = await Book.deleteOne({_id: req.body._id});
    res.json(bookDel);
}