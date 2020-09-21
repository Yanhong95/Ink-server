const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

router.get('/loadCatalog', updateController.loadCatalog);


module.exports = router;