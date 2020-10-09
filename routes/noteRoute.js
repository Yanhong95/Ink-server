const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const isAuth = require('../middleware/is-auth');

router.post('/saveNote', noteController.saveNote);

router.post('/loadTopic', noteController.loadTopic);
router.post('/loadNote', noteController.loadNote);
router.get('/loadCatalog', noteController.loadCatalog);
router.post('/addNote', isAuth, noteController.addNote);


module.exports = router;