var db = require('../db');

module.exports.countCart = function(req, res, next) {
    var sessionId = req.signedCookies.sessionId;
    var object = db.get('sessions').find({id: sessionId}).value();
    function getObjectKey(obj) {
        // Write code here...
        var newArr = [];
        for (var x in obj) {
          //console.log(obj[x]);
          newArr.push(x);
          if (typeof obj[x] == 'object') {
            newArr = newArr.concat(getObjectKey(obj[x]));
          }
        }
        return newArr;
      }
    var arr = getObjectKey(object);
    var newArr = arr.slice(2);
    var sum = 0;
    for(var i = 0; i < newArr.length; i++) {
        var temp = db.get('sessions').find({id: sessionId}).get('cart.' + newArr[i]).value();
        sum += temp;
    }
    res.locals.haha = sum;
    next();
}