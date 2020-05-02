var db = require('../db');

module.exports.countPage = function(req, res, next) {
    var arr = db.get('products').value();
    var num = Math.round(arr.length / 8);
    var pageNum = parseInt(req.query.page) || 1;
    res.locals.mainNum = pageNum;
    res.locals.leftNum = pageNum - 1;
    res.locals.rightNum = pageNum + 1;
    res.locals.goToLast = num;
    res.locals.goToFirst = num - num + 1;
    next();
}