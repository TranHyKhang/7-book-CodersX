var express = require('express');
var router = express.Router();
var controller = require('../controllers/user.controller');
var validate = require('../validate/user.validate');
var countCookie = require('../middlewares/countCookie.middleware');

// Main page
router.get('/', countCookie.countCookie, controller.index);

// test cookie
// router.get('/cookie', countCookie.countCookie, controller.generateCookie);

// Create user
router.get('/create', countCookie.countCookie, controller.create);

router.post('/create', countCookie.countCookie, validate.postCreate, controller.postCreate);

// Search user
router.get('/search', countCookie.countCookie, controller.search);

// Delete user
router.get('/:id/delete', countCookie.countCookie, controller.delete);

// Update user
router.get('/:id/update', countCookie.countCookie, controller.update);

router.post('/update', countCookie.countCookie, controller.postUpdate);

module.exports = router;