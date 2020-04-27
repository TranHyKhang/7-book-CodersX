var express = require('express');
var router = express.Router();
var controller = require('../controllers/transaction.controller');

// Main page
router.get('/', controller.index);

// Create page
router.get('/create', controller.create);

router.post('/create', controller.postCreate);

// Delete 
router.get('/:id/delete', controller.delete);


module.exports = router;