var express = require('express');
var router = express.Router();
var multer = require('multer');
var controller = require('../controllers/book.controller.js');

var upload = multer({ dest: './public/uploads/' })

// render main page
router.get('/', controller.index);

// create book
router.get('/create', controller.create);

router.post('/create',upload.single('cover'), controller.postCreate);

// Search book
router.get('/search', controller.search);

// Delete book
router.get('/:id/delete', controller.delete);

// Update book
router.get('/:id/update', controller.update);
router.post('/update', controller.postUpdate);

module.exports = router;