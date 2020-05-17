var User = require('../models/user.model');
var Business = require('../models/business.model');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    enviroment_variable: process.env.CLOUDINARY_URL
});


module.exports.index = async(req, res) => {
    var business = await Business.find({businessId: req.params.id});
    var id = req.params.id;
    res.render('business/index', {
        business: business,
        id: id
    });
}

module.exports.createPage = (req, res) => {
    var id = req.params.id;
    res.render('business/create', {id: id});
}

module.exports.postCreate = async(req, res) => {
    var newBook = await Business.create(req.body);
    await newBook.save();
    res.redirect("/shops/" + newBook._doc.businessId + "/books");
}

module.exports.delete = async(req, res) => {
    var deleteBook = await Business.deleteOne({_id: req.params.id});
    res.redirect("back");
}

module.exports.updatePage = async(req, res) => {
    var id = req.params.id;
    var user = await Business.findById({_id: id});
    res.render('business/update', {
        id: id,
        user: user
    });
}

module.exports.postUpdate = async(req, res) => {
    var id = req.body.id;
    var updateBook = await Business.findByIdAndUpdate({_id: id}, {$set: req.body})
    res.redirect("/shops/" + updateBook._doc.businessId + "/books");
}

module.exports.updateCoverPage = async(req, res) => {
    var id = req.params.id;
    var user = await Business.findById({_id: id});
    res.render('business/bookCover', {
        id: id,
        user: user
    });
}

module.exports.postUpdateCover = async(req, res) => {
    var file = req.file.path.split('\\').join('/');
    await cloudinary.uploader.destroy("bookCoverBusiness/" + req.body.id, (err, result) => {
        console.log(result, err);
    });
    var rs = await cloudinary.uploader.upload(file, { public_id: "bookCoverBusiness/" + req.body.id })
    var newAvatar = await cloudinary.url(rs.public_id);
    console.log(newAvatar);
    await Business.findByIdAndUpdate({_id: req.body.id}, {$set: {bookCover: newAvatar}});
    res.redirect('/shops/' + req.body.id + '/books/update');
}
