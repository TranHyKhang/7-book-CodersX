const express = require('express');
const router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get('/', controller.index);

router.post('/create', controller.create);

router.put('/completed', controller.isCompleted);

router.delete('/deleted', controller.delete);

module.exports = router;
