const express = require('express');
const app = express();
const port = 3000;
// var db = require('./db');
var bookRoute = require('./routes/book.route');
var userRoute = require('./routes/user.route');
var transactionRoute = require('./routes/transaction.route');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('index');
})

app.use('/books', bookRoute);
app.use('/users', userRoute);
app.use('/transactions', transactionRoute);

app.listen(port);