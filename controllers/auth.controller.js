// var md5 = require('md5');
var bcrypt = require('bcrypt');
var db = require('../db');

module.exports.login = function(req, res) {
    res.render('auth/login');
}

module.exports.postLogin = function(req, res) {
    var email = req.body.email; 
    var password = req.body.password;
    var user = db.get('users').find({email: email}).value();
    if(!user) {
        res.render('auth/login', {
            errors: [
                "User does not exist !!!"
            ],
            values: req.body    
        });
        return;
    }
    // var hashPassword = md5(password);
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(user.password !== password ) {
                res.render('auth/login', {
                    errors: [
                        "Wrong password !!!"
                    ],
                    values: req.body
                });
                return;
            }
        });
    });
    
    res.cookie('userId', user.id);
    res.redirect('/users');

}