var shortid = require('shortid');
var User = require('../models/user.model');

var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    enviroment_variable: process.env.CLOUDINARY_URL
});
var defaultAvatar = cloudinary.url('default_avatar_fw7ujs.png');

// Index
module.exports.index = async function(req, res, next) {
    try{
        var userMatched = await User.findOne({_id: req.signedCookies.userId});
        var user = await User.find();
        if(userMatched.isAdmin == "false"){
            res.render('users/index', {
                users: [userMatched]
            });
        } else {
            res.render('users/index', {
                users: user
            })
        }
    } catch(err) {
        next(err);
    };  
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
    bcrypt.hash(req.body.password, 10, async(err, hash) => { 
        req.body.password = hash;
        req.body.isAdmin = "false";
        // var file = req.file.path.split("\\").join("/");
        // var rs = await cloudinary.uploader.upload(file, 
        //     { public_id: "avatarCodersX/" + req._id});
        // req.body.avatar = await cloudinary.url(rs.public_id);
        await User.create(req.body);
        
        res.redirect('/users')
    });    
};
 
// Search
module.exports.search = async function(req, res) {
    var q = req.query.q;
    var user = await User.find();
    var matchedUser = user.filter(user => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('users/index', {
        users: matchedUser
    });
};

// Delete
module.exports.delete = async function(req, res) {
    await User.remove({_id: req.params.id});
    res.redirect('/users');
};

// Update
module.exports.update = async function(req, res) {
    var id = req.params.id;
    var user = await User.findOne({
        _id: id,
        user: user
    });
    res.render('users/update', {id});
};

module.exports.postUpdate = async function(req, res) {
    await User.findByIdAndUpdate({_id: req.body.id}, {name: req.body.name});
    res.redirect('/users');
};

// avatar
module.exports.changeAvatar = async function(req, res) {
    var idUser = req.params.id;
    var matchedUser = await User.findOne({_id: idUser});
    res.render('./users/avatar', {
        user: matchedUser,
        avatar: matchedUser.avatar || defaultAvatar
    });
}

module.exports.postChangeAvatar = async function(req, res) {
    var file = req.file.path.split('\\').join('/');
    await cloudinary.uploader.destroy("avatarCodersX/" + req.body.id, (err, result) => {
        console.log(result, err);
    });
    var rs = await cloudinary.uploader.upload(file, { public_id: "avatarCodersX/" + req.body.id })
    var newAvatar = await cloudinary.url(rs.public_id);
    console.log(newAvatar);
    await User.findByIdAndUpdate({_id: req.body.id}, {$set: {avatar: newAvatar}});
    res.redirect('/users/' + req.body.id + '/update');
}