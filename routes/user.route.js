var express = require('express');
var router = express.Router();

var db = require('../db');

// Main page
router.get('/', function(req, res) {
    res.render('users/index', {
        users: db.get('users').value()
    });
})