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
    bcrypt.compare(password, user.password, function(err, result) {
        var count = user.wrongLoginCount;
        if(!result) {
            count++;
            db.get('users').find({email: email}).assign({wrongLoginCount: count}).write();
            if(count >= 4) {
                res.send('Nhap sai qua nhieu lan!!');
                return;
            }
            res.render('auth/login', {
                errors: [
                    "Wrong password !!!"
                ],
                values: req.body
            });
            return;
        }
        res.cookie('userId', user.id, {
            signed: true
        });
        db.get('users').find({email: email}).assign({wrongLoginCount: 0}).write();
        res.redirect('/users');
    })
} 