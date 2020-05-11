// var md5 = require('md5');
var bcrypt = require('bcrypt');
// var db = require('../db');
var User = require('../models/user.model');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'minhhthu.2803@gmail.com',
  from: 'tranhykhang8108@gmail.com',
  subject: 'Nhap sai mk',
  text: 'Nhap sai qua nhieu lan',
  html: '<strong>Nhap sai qua nhieu lan</strong>'
};
module.exports.login = function(req, res) {
    res.render('auth/login');
}

module.exports.postLogin = async function(req, res) {
    var email = req.body.email; 
    var password = req.body.password;
    var user = await User.findOne({email});
    console.log(user._doc.wrongLoginCount)
    if(!user) {
        res.render('auth/login', {
            errors: [
                "User does not exist !!!"
            ],
            values: req.body    
        });
        return;
    }
    bcrypt.compare(password, user.password, async function(err, result) {
        
        if(!result) {
            var count = user._doc.wrongLoginCount;
            count++;
            console.log(count)
            await User.updateOne({email: email},{$set: {wrongLoginCount: count}});
            
            if(count >= 4) {
                res.send('Nhap sai qua nhieu lan!!');
                sgMail
                    .send(msg)
                    .then(() => {}, error => {
                        console.error(error);

                        if (error.response) {
                        console.error(error.response.body)
                        }
                    });
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
        res.cookie('userId', user._id, {
            signed: true
        });
        await User.updateOne({email: email},{$set: {wrongLoginCount: 0}});
        
        res.redirect('/users');
    })
} 
