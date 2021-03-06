var express = require('express');
var router = express.Router();
var controller = require('../controllers/transaction.controller');

// Main page
router.get('/', controller.index);

// Create page
router.get('/create', controller.create);

router.post('/create', controller.postCreate);

// complete 
router.get('/:id/complete', controller.complete);

// Delete
router.get('/:id/delete', controller.delete);

// Borrow book
router.post('/', controller.borrowBook)


module.exports = router;