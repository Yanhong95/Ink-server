const express = require('express');
const router = express.Router();
const S3Controller = require('../controllers/S3Controller');
const isAuth = require('../middleware/is-auth');

router.get('/getS3SignedUrl', isAuth, S3Controller.getS3SignedUrl);

module.exports = router;