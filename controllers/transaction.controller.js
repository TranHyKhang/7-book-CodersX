var db = require('../db');
var shortid = require('shortid');
var User = require('../models/user.model');
var Book = require('../models/book.model');
var Transaction = require('../models/transaction.model');

// Index
module.exports.index =async function(req, res) {
    var userTran = await Transaction.find({userId: req.signedCookies.userId});
    console.log(userTran);
    // Pagination
    // var page = parseInt(req.query.page)||1; //n (Trang thu n)
    // var perPage = 5; //x (So san pahm trong 1 trang)
    // //start = (n - 1) * x;
    // var start = (page - 1) * perPage;
    // //end = (n - 1) * x + x = n * x;
    // var end = page * perPage;
    // var arr = userTran.slice(start, end);
    res.render('transactions/index', {
        trans: userTran
    });
};

// Create
module.exports.create = async function(req, res) {
    var user = await User.findById({_id: req.signedCookies.userId});
    var books = await Book.find();
    res.render('transactions/create', {
        users: [user],
        books: books
    });
};

module.exports.postCreate = async function(req, res) {
    // req.body.id = req.signedCookies.userId;
    // req.body.idBorrowed = shortid.generate();
    // req.body.isComplete = "false";
    // db.get('trans').push(req.body).write();
    // res.redirect('/transactions');

    var newTran = new Transaction({
        bookName: req.body.bookName,
        userName: req.body.userName,
        userId: req.signedCookies.userId,
        borrowedId: shortid.generate(),
        isCompleted: "false"
    })

    await newTran.save();
    res.redirect('/transactions');


};

// Delete
module.exports.delete =async function(req, res) {
    var id = req.params.id;
    await Transaction.remove({borrowedId: id});
    res.redirect('/transactions');
};

// Complete
module.exports.complete = async function(req, res) {
    var id = req.params.id;
    await Transaction.findOneAndUpdate({borrowedId: id}, {$set: {isCompleted: "true"}});
    res.redirect('/transactions');
};

// Borrow book
module.exports.borrowBook = function(req, res) {
    var sessionId = req.signedCookies.sessionId;
    var userId = req.signedCookies.userId;
    var user = db.get('bookSessions').find({id: sessionId}).value();
    db.get('trans').push(user).write();
    db.get('trans').find({id: sessionId}).assign({id: userId}).write();
    //db.get('bookSessions').remove({id: sessionId}).write();

    var userBorrowed = db.get('trans').find({id: userId}).value();
    var a = db.get('users').find({id: userBorrowed.id}).value();

    function getObjectKey(obj) {
        // Write code here...
        var newArr = [];
        for (var x in obj) {
          //console.log(obj[x]);
          newArr.push(x);
          if (typeof obj[x] == 'object') {
            newArr = newArr.concat(getObjectKey(obj[x]));
          }
        }
        return newArr;
    }

    var arr = getObjectKey(userBorrowed).slice(2);
    var arrBook = [];
    for(var i = 0; i < arr.length; i++) {
        arrBook.push(db.get('books').find({id: arr[i]}).value());
    }
    res.render('transactions/index', {
        books: arrBook,
        users: [a]
    })
}