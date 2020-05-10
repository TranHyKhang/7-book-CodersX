var db = require('../db');
var shortid = require('shortid');

// Index
module.exports.index = function(req, res) {
    var userTran = db.get('trans').value()
    var newArr = userTran.filter(user => {
        return user.id === req.signedCookies.userId;
    });
    // Pagination
    var page = parseInt(req.query.page)||1; //n (Trang thu n)
    var perPage = 5; //x (So san pahm trong 1 trang)
    //start = (n - 1) * x;
    var start = (page - 1) * perPage;
    //end = (n - 1) * x + x = n * x;
    var end = page * perPage;
    var arr = newArr.slice(start, end);
    res.render('transactions/index', {
        trans: arr
    });
};

// Create
module.exports.create = function(req, res) {
    var user = db.get('users').find({id: req.signedCookies.userId}).value()
    res.render('transactions/create', {
        users: [user],
        books: db.get('books').value()
    });
};

module.exports.postCreate = function(req, res) {
    req.body.id = req.signedCookies.userId;
    req.body.idBorrowed = shortid.generate();
    req.body.isComplete = "false";
    db.get('trans').push(req.body).write();
    res.redirect('/transactions');
};

// Delete
module.exports.delete = function(req, res) {
    var id = req.params.id;
    db.get('trans').remove({idBorrowed: id}).write();
    res.redirect('/transactions');
};

// Complete
module.exports.complete = function(req, res) {
    var id = req.params.id;
    db.get('trans').find({idBorrowed: id}).assign({isComplete: "true"}).write(); 
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