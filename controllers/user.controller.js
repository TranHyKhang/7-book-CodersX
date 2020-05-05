var shortid = require('shortid');
var db = require('../db');
// var md5 = require('md5');
var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    enviroment_variable: process.env.CLOUDINARY_URL
})
var defaultAvatar = cloudinary.url('default_avatar_fw7ujs.png');
// Index
module.exports.index = function(req, res) {
    var user = db.get('users').find({id: req.signedCookies.userId}).value();
    if(user.isAdmin == "false"){
        res.render('users/index', {
            users: [user]
        });
    } else {
        res.render('users/index', {
            users: db.get('users').value()
        })
    }
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
    //req.body.avatar = req.file.path.split("\\").slice(1).join("/");  
    bcrypt.hash(req.body.password, 10, async(err, hash) => {
        req.body.id = shortid.generate();
        req.body.password = hash;
        req.body.isAdmin = "false";
        var file = req.file.path.split("\\").join("/");
        var rs = await cloudinary.uploader.upload(file, 
            { public_id: "avatarCodersX/" + req.body.id } );
        req.body.avatar = await cloudinary.url(rs.public_id);
        db.get("users")
            .push(req.body)
            .write();
        // var success = "Tạo tài khoản thành công!";
        // res.render("./users/create", {
        //     success: success
        // });
        res.redirect('/users')
    }); 
    
    
};

// bcrypt.hash(req.body.password, 10, function(err, hash) {
//     // Store hash in your password DB.
//     req.body.password = hash;
//     req.body.id = shortid.generate();
//     req.body.isAdmin = "false";
//     var file = req.file.path.split("\\").join("/");
//     var rs = cloudinary.uploader.upload(file, {
//         public_id:"avatarCodesX"
//     });
//     var a;
//     rs.then(function(data) {
//         console.log(data);
//         a = data.url;
//         return  data.url;
//     } );
//     console.log(a);
//     db.get('users').push(req.body).write();
    
// });
// res.redirect('/users');

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
    res.redirect('/users');
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

// avatar
module.exports.changeAvatar = function(req, res) {
    var idUser = req.params.id;
    var matchedUser = db.get('users').find({ id: idUser }).value();
    res.render('./users/avatar', {
        user: matchedUser,
        avatar: matchedUser.avatar || defaultAvatar
    });
    // var id = req.params.id;
    // res.render('users/avatar', {id});
}

module.exports.postChangeAvatar = async function(req, res) {
    var file = req.file.path.split('\\').join('/');
    var matchedUser = db.get('users').find({ id: req.body.id }).value();
    await cloudinary.uploader.destroy("avatarCodersX/" + req.body.id );
    var rs = await cloudinary.uploader.upload(file, { public_id: "avatarCodersX/" + req.body.id })
    var newAvatar = await cloudinary.url(rs.public_id);
    console.log(newAvatar);
    db.get('users')
        .find({ id: req.body.id })
        .assign({ avatar: newAvatar })
        .write();
    res.redirect('/users/' + req.body.id + '/update');
    // res.render('./users/update', {
    //     users: matchedUser,
    //     avatar: matchedUser.avatar || defaultAvatar
    // });

    // var id = req.params.id;
    // var file = req.file.path.split('\\').join('/');
    // var rs = await cloudinary.uploader.upload(file, {
    //     public_id: "avatarCodersX/" + req.body.id
    // });
    // req.body.avatar = await cloudinary.url(rs.public_id);
    // db.get('users').find({id: id}).assign({avatar: req.body.avatar}).write();
    // res.render('users/update');
}