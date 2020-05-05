var db = require('../db');

module.exports.index = function(req, res) {
    var page = parseInt(req.query.page) || 1; //n (Trang thu n)
    var perPage = 8; //x (So san pahm trong 1 trang)
    //start = (n - 1) * x;
    var start = (page - 1) * perPage;
    //end = (n - 1) * x + x = n * x;
    var end = page * perPage;

    // Count cart
    // var a = db.get('sessions').find({id: req.signedCookies.sessionId}).get('cart.')
    // console.log(a);


    res.render('products/index', {
        products: db.get('products').value().slice(start, end)
    })
}