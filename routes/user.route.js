var express = require('express');
var router = express.Router();
var controller = require('../controllers/user.controller');

// Main page
router.get('/', controller.index);

// Create user
router.get('/create', controller.create);

router.post('/create', controller.postCreate);

// Search user
router.get('/search', controller.search);

// Delete user
router.get('/:id/delete', controller.delete);

// Update user
router.get('/:id/update', controller.update);

router.post('/update', controller.postUpdate);

module.exports = router;