var shortid = require('shortid');
var db = require('../db');
var md5 = require('md5');
// Index
module.exports.index = function(req, res) {
    var user = db.get('users').find({id: req.cookies.userId}).value();
    console.log(user);
    res.render('users/index', {
        usersMatched: [user]
    });
};

// // Count cookie
// module.exports.generateCookie = function(req, res, next) {
//     res.cookie('user-id', 12345);
//     res.send('hello');
// };

// Create
module.exports.create = function(req, res) {
    res.render('users/create');
};

module.exports.postCreate = function(req, res) {
    req.body.id = shortid.generate();
    req.body.password = md5(req.body.password);
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