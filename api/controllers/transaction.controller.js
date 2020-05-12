var Trans = require('../../models/transaction.model');

module.exports.index = async (req, res) => {
    var trans = await Trans.find();
    res.json(trans);
}

module.exports.create = async (req, res) => {
    var newTran = await Trans.create(req.body);
    res.json(newTran);
}

module.exports.isCompleted = async (req, res) => {
    var tranMatched = await Trans.findByIdAndUpdate({borrowedId: req.body.borrowedId}, {$set: {isCompleted: "true"}});
    res.json(tranMatched);
}

module.exports.delete = async (req, res) => {
    var tranDeleted = await Trans.deleteOne({borrowedId: req.body.borrowedId});
    res.json(tranDeleted);
}