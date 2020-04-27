var shortid = require('shortid');
var db = require('../db');

// Index
module.exports.index = function(req, res) {
    res.render('users/index', {
        users: db.get('users').value()
    });
};

// Create
module.exports.create = function(req, res) {
    res.render('users/create')
};

module.exports.postCreate = function(req, res) {
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write();
    res.redirect('/users');
};

// Search
module.exports.search = function(req, res) {
    var q = req.query.q;
    var matchedUser = db.get('users').value().filter(user => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('users/index', {
        users: matchedUser
    });
};

// Delete
module.exports.delete = function(req, res) {
    var id = req.params.id;
    db.get('users').remove({id: id}).write();
    res.render('users/index', {
        users: db.get('users').value()
    });
};

// Update
module.exports.update = function(req, res) {
    var id = req.params.id;
    res.render('users/update', {id});
};

module.exports.postUpdate = function(req, res) {
    db.get('users').find({id: req.body.id}).assign({name: req.body.name}).write();
    res.redirect('/users');
};