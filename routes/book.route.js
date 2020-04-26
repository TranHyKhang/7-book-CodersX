var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var db = require('../db');

// render main page
router.get('/', function(req, res) {
    res.render('books/index', {
        books: db.get('books').value()
    });
});

// create book
router.get('/create', function(req, res) {
    res.render('books/create');
});

router.post('/create', function(req, res) {
    req.body.id = shortid.generate();
    db.get('books').push(req.body).write();
    res.redirect('/books');
});

// Search book
router.get('/search', function(req, res) {
    var q = req.query.q;
    var matchedBook = db.get('books').value().filter(book => {
        return book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('books/index', {
        books: matchedBook
    });
});

// Delete book
router.get('/:id/delete', function(req, res) {
    var id = req.params.id;
    var delBook = db.get('books').find({id: id}).value();
    db.get('books').remove({id: delBook.id}).write();
    res.render('books/index', {
        books: db.get('books').value()
    });
});

// Update book
router.get('/:id/update', function(req, res) {
    var id = req.params.id;
    res.render('books/update',{id});
})
router.post('/update', function(req, res) {
    db.get('books').find({id: req.body.id}).assign({name: req.body.name}).write();
    res.redirect('/books');
})

module.exports = router;