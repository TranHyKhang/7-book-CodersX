var db = require('../db');
var shortid = require('shortid');

// Index
module.exports.index = function(req, res) {
    var userTran = db.get('trans').value()
    var newArr = userTran.filter(user => {
        return user.id === req.signedCookies.userId;
    });
    res.render('transactions/index', {
        trans: newArr
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