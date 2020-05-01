const db = require('../db');

module.exports.requireMainAuth = (req, res, next) => {
  var user = req.cookies.userId;
  var admin = db.get('users').find({ isAdmin: 'true' }).value();
  if(admin.id === user)
  {
    res.locals.isAdmin = true;
}
  
  next();
}; 
