var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var db = require('../db');

// Main page
router.get('/', function(req, res) {
    res.render('users/index', {
        users: db.get('users').value()
    });
})

// Create user
router.get('/create', function(req, res) {
    res.render('users/create')
});

router.post('/create', function(req, res) {
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write();
    res.redirect('/users');
})

// Search user
router.get('/search', function(req, res) {
    var q = req.query.q;
    var matchedUser = db.get('users').value().filter(user => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('users/index', {
        users: matchedUser
    })
})

// Delete user
router.get('/:id/delete', function(req, res) {
    var id = req.params.id;
    db.get('users').remove({id: id}).write();
    res.render('users/index', {
        users: db.get('users').value()
    })
})

// Update user
router.get('/:id/update', function(req, res) {
    var id = req.params.id;
    res.render('users/update', {id});
})

router.post('/update', function(req, res) {
    db.get('users').find({id: req.body.id}).assign({name: req.body.name}).write();
    res.redirect('/users');
})


module.exports = router;