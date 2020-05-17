const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/business.controller');

var upload = multer({ dest: './public/uploads/' })

router.get('/:id/books', controller.index);

router.get('/:id/books/create', controller.createPage);

router.post('/books/create', controller.postCreate);

router.get('/:id/books/delete', controller.delete);

router.get('/:id/books/update', controller.updatePage);

router.post('/books/update', controller.postUpdate);

router.get('/:id/books/cover', controller.updateCoverPage);

router.post('/books/cover',upload.single('bookCover'), controller.postUpdateCover);

module.exports = router;