const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/saveNote', noteController.saveNote);

router.post('/loadTopic', noteController.loadTopic);
router.post('/loadNote', noteController.loadNote);
router.get('/loadCatalog', noteController.loadCatalog);
router.post('/addNote', noteController.addNote);


module.exports = router;