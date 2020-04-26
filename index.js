const express = require('express');
const app = express();
const port = 3000;
var shortid = require('shortid');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('db.json');
const db = low(adapter);
 
// Set some defaults
db.defaults({ books: []}).write();

// render main page
app.get('/', function(req, res) {
    res.render('index', {
        books: db.get('books').value()
    });
});

// create book
app.get('/create', function(req, res) {
    res.render('books/create');
});

app.post('/create', function(req, res) {
    req.body.id = shortid.generate();
    db.get('books').push(req.body).write();
    res.redirect('/');
});

// Search book
app.get('/search', function(req, res) {
    var q = req.query.q;
    var matchedBook = db.get('books').value().filter(book => {
        return book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('index', {
        books: matchedBook
    });
});

// Delete book
app.get('/:id/delete', function(req, res) {
    var id = req.params.id;
    var delBook = db.get('books').find({id: id}).value();
    db.get('books').remove({id: delBook.id}).write();
    res.render('index', {
        books: db.get('books').value()
    });
});

// Update book
app.get('/:id/update', function(req, res) {
    var id = req.params.id;
    res.render('books/update',{
        id: id
    });
})
app.post('/update', function(req, res) {
    db.get('books').find({id: req.body.id}).assign({name: req.body.name}).write();
    res.redirect('/');
})

// db.get('books').find({id: "3hWnVyMLP"}).assign({name:"hhhhhhhhhhhhhh"}).write();








app.listen(port);