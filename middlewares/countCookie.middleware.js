module.exports.countCookie = (req, res, next) => {
    res.cookie('users: ', 1234);

    var cookie = req.cookies.count;
    
    if (cookie === undefined)
    {
    //   var randomNumber = Math.random().toString();
    //   randomNumber = randomNumber.substring(2, 5);
      res.cookie('count', 1);
    } 
    else {
      var count = parseInt(req.cookies.count); 
      count++;
      res.cookie('count', count);
      console.log(`count: ${count}`); 
    }
    
    next();
};