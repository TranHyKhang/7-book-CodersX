require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


const port = 3000;
// var db = require('./db');
var bookRoute = require('./routes/book.route');
var userRoute = require('./routes/user.route');
var transactionRoute = require('./routes/transaction.route');
var authRoute = require('./routes/auth.route');
var productRoute = require('./routes/product.route');
var cartRoute = require('./routes/cart.route');

// RESTful API
var apiProductRoute = require('./api/routes/product.route');
var apiAuthRoute = require('./api/routes/auth.route');
var apiTransactionRoute = require('./api/routes/transaction.route');
var apiBookRoute = require('./api/routes/book.route');
var apiUserRoute = require('./api/routes/user.route');

var authMiddleware = require('./middlewares/auth.middleware');
var productMiddleware = require('./middlewares/product.middleware');
// const mainauthMiddleware = require("./middlewares/authmain.middleware");
var transPaginateMiddleware = require('./middlewares/transPaginate.middleware');
var sessionMiddleware = require('./middlewares/session.middleware');
var countMiddleware = require('./middlewares/countCart.middleware');


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
})

app.use('/books',countMiddleware.countCart, bookRoute);
app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/transactions', authMiddleware.requireAuth,transPaginateMiddleware.countPage, transactionRoute);
app.use('/auth', authRoute);
// check countCart.middleware if use /products
app.use('/products',productMiddleware.countPage, productRoute);
app.use('/cart', cartRoute);

// RESTful API
app.use('/api/products', apiProductRoute);
app.use('/api/login', apiAuthRoute);
app.use('/api/transactions', apiTransactionRoute);
app.use('/api/books', apiBookRoute);
app.use('/api/user', apiUserRoute);

app.listen(port);