var db = require('../db');
var shortid = require('shortid');

// Index
module.exports.index = function(req, res) {
    var userTran = db.get('trans').value()
    var newArr = userTran.filter(user => {
        return user.id === req.cookies.userId;
    });
    res.render('transactions/index', {
        trans: newArr
    });
};

// Create
module.exports.create = function(req, res) {
    var user = db.get('users').find({id: req.cookies.userId}).value()
    res.render('transactions/create', {
        users: [user],
        books: db.get('books').value()
    });
};

module.exports.postCreate = function(req, res) {
    req.body.id = req.cookies.userId;
    req.body.idBorrowed = shortid.generate();
    req.body.isComplete = "false";
    db.get('trans').push(req.body).write();
    res.redirect('/transactions');
};

// Delete
module.exports.delete = function(req, res) {
    var id = req.params.id;
    db.get('trans').remove({idBorrowed: id}).write();
    var userTran = db.get('trans').value()
    var newArr = userTran.filter(user => {
        return user.id === req.cookies.userId;
    });
    console.log(newArr);
    res.render('transactions/index', {
        trans: newArr
    });
};

// Complete
module.exports.complete = function(req, res) {
    var id = req.params.id;
    db.get('trans').find({idBorrowed: id}).assign({isComplete: "true"}).write(); 
    var userTran = db.get('trans').value()
    var newArr = userTran.filter(user => {
        return user.id === req.cookies.userId;
    });
    res.render('transactions/index', {
        trans: newArr
    });
};