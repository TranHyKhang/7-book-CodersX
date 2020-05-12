const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

module.exports.index = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var user = await User.findOne({email: email});
    if(!user) {
        res.json({message: "user does not exist"});
        return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            res.json(user);
        }
    })
};