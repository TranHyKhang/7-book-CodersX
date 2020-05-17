var db = require('../db');
var shortid = require('shortid');
var Book = require('../models/book.model');

// index
module.exports.index = async function(req, res) {
    var book = await Book.find()
    res.render('books/index', {
        books: book
    });
};

// Search
module.exports.search = async function(req, res) {
    var q = req.query.q;
    var a = await Book.find();
    var matchedBook = a.filter(book => {
        return book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('books/index', {
        books: matchedBook
    });
};

// Create
module.exports.create = function(req, res) {
    res.render('books/create');
};

module.exports.postCreate = async function(req, res) {
    //req.body.id = shortid.generate();
    var data = req.file.path.split('\\').slice(1).join('/');
    //db.get('books').push(req.body).write();
    var newBook = new Book({
        name: req.body.name,
        description: req.body.desc,
        coverUrl: data
    });
    await newBook.save();
    res.redirect('/books');
};

// Delete
module.exports.delete = async function(req, res) {
    var id = req.params.id;
    // var delBook = db.get('books').find({id: id}).value();
    // db.get('books').remove({id: delBook.id}).write();
    await Book.remove({_id: id});

    res.redirect('/books')
};

// Update
module.exports.update = function(req, res) {
    var id = req.params.id;
    res.render('books/update',{id});
};

module.exports.postUpdate = async function(req, res) {
    //db.get('books').find({id: req.body.id}).assign({name: req.body.name}).write();
    await Book.updateOne({ _id: req.body.id }, { $set :{ name: req.body.name }});
    res.redirect('/books');
};

// Add book to cart
module.exports.addToCart = function(req, res) {
    var sessionId = req.signedCookies.sessionId;
    var bookId = req.params.bookId;
    if(!sessionId) {
        res.redirect('/books');
        return;
    }
    var count = db.get('bookSessions')
                  .find({id: sessionId})
                  .get('cart.' + bookId, 0)
                  .value();
    db.get('bookSessions')
      .find({id: sessionId})
      .set('cart.' + bookId, count + 1)
      .write();
    
    res.redirect('/books');
}