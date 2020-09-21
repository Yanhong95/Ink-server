const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/loadTopic', noteController.loadTopic);
router.post('/loadNote', noteController.loadNote);
router.post('/saveNote', noteController.saveNote);


module.exports = router;