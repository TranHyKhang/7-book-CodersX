var express = require('express');

var multer  = require('multer');

var router = express.Router();
var controller = require('../controllers/user.controller');
var validate = require('../validate/user.validate');


var upload = multer({ dest: './public/uploads/' })

// var countCookie = require('../middlewares/countCookie.middleware');

// Main page
router.get('/', controller.index);

// test cookie
// router.get('/cookie',countCookie.countCookie,  controller.generateCookie);

// Create user
router.get('/create', controller.create);

router.post('/create', upload.single('avatar'), validate.postCreate, controller.postCreate);

// Search user
router.get('/search', controller.search);

// Delete user
router.get('/:id/delete', controller.delete);

// Update user
router.get('/:id/update', controller.update);

router.post('/update', controller.postUpdate);

// Change avatar
router.get('/:id/avatar', controller.changeAvatar);
router.post('/avatar', upload.single('avatar'), controller.postChangeAvatar);

module.exports = router;