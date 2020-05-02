require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const port = 3000;
console.log(process.env.SESSION_SECRET)
// var db = require('./db');
var bookRoute = require('./routes/book.route');
var userRoute = require('./routes/user.route');
var transactionRoute = require('./routes/transaction.route');
var authRoute = require('./routes/auth.route');
var authMiddleware = require('./middlewares/auth.middleware');
// const mainauthMiddleware = require("./middlewares/authmain.middleware");


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('index');
})

app.use('/books', authMiddleware.requireAuth, bookRoute);
app.use('/users',  authMiddleware.requireAuth, userRoute);
app.use('/transactions', authMiddleware.requireAuth, transactionRoute);
app.use('/auth', authRoute);

app.listen(port);