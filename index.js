require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const port = 3000;
// var db = require('./db');
var bookRoute = require('./routes/book.route');
var userRoute = require('./routes/user.route');
var transactionRoute = require('./routes/transaction.route');
var authRoute = require('./routes/auth.route');
var productRoute = require('./routes/product.route');
var cartRoute = require('./routes/cart.route');

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

app.use('/books', bookRoute);
app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/transactions', authMiddleware.requireAuth,transPaginateMiddleware.countPage, transactionRoute);
app.use('/auth', authRoute);
app.use('/products',productMiddleware.countPage,countMiddleware.countCart, productRoute);
app.use('/cart', cartRoute);

app.listen(port);