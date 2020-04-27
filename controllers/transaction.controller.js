var db = require('../db');
var shortid = require('shortid');

// Index
module.exports.index = function(req, res) {
    res.render('transactions/index', {
        trans: db.get('trans').value()
    });
};

// Create
module.exports.create = function(req, res) {
    res.render('transactions/create', {
        users: db.get('users').value(),
        books: db.get('books').value()
    });
};

module.exports.postCreate = function(req, res) {
    req.body.id = shortid.generate();
    db.get('trans').push(req.body).write();
    res.redirect('/transactions');
};

// Delete
module.exports.delete = function(req, res) {
    var id = req.params.id;
    db.get('trans').remove({id: id}).write();
    res.render('transactions/index', {
        trans: db.get('trans').value()
    });
};