var express = require('express');
var router = express.Router();
var db = require('../db');
var shortid = require('shortid');

// Main page
router.get('/', function(req, res) {
    res.render('transactions/index', {
        trans: db.get('trans').value()
    });
});

// Create page
router.get('/create', function(req, res) {
    res.render('transactions/create', {
        users: db.get('users').value(),
        books: db.get('books').value()
    });
});

router.post('/create', function(req, res) {
    req.body.id = shortid.generate();
    db.get('trans').push(req.body).write();
    res.redirect('/transactions');
})

// Delete 
router.get('/:id/delete', function(req, res) {
    var id = req.params.id;
    db.get('trans').remove({id: id}).write();
    res.render('transactions/index', {
        trans: db.get('trans').value()
    });
})


module.exports = router;