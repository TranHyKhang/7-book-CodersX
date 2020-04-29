var express = require('express');
var router = express.Router();
var controller = require('../controllers/user.controller');
var validate = require('../validate/user.validate');

// var countCookie = require('../middlewares/countCookie.middleware');

// Main page
router.get('/', controller.index);

// test cookie
// router.get('/cookie',countCookie.countCookie,  controller.generateCookie);

// Create user
router.get('/create', controller.create);

router.post('/create', validate.postCreate, controller.postCreate);

// Search user
router.get('/search', controller.search);

// Delete user
router.get('/:id/delete', controller.delete);

// Update user
router.get('/:id/update', controller.update);

router.post('/update', controller.postUpdate);

module.exports = router;