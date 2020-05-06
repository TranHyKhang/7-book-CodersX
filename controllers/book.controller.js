var db = require('../db');
var shortid = require('shortid');

// index
module.exports.index = function(req, res) {
    res.render('books/index', {
        books: db.get('books').value()
    });
};

// Search
module.exports.search =  function(req, res) {
    var q = req.query.q;
    var matchedBook = db.get('books').value().filter(book => {
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

module.exports.postCreate = function(req, res) {
    req.body.id = shortid.generate();
    req.body.coverUrl = req.file.path.split('\\').slice(1).join('/');
    db.get('books').push(req.body).write();
    res.redirect('/books');
};

// Delete
module.exports.delete = function(req, res) {
    var id = req.params.id;
    var delBook = db.get('books').find({id: id}).value();
    db.get('books').remove({id: delBook.id}).write();
    res.redirect('/books')
};

// Update
module.exports.update = function(req, res) {
    var id = req.params.id;
    res.render('books/update',{id});
};

module.exports.postUpdate = function(req, res) {
    db.get('books').find({id: req.body.id}).assign({name: req.body.name}).write();
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