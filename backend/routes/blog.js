const express = require('express');
const { uploadPostImage } = require('../controllers/uploadController');

const router = express.Router();

// Blog image upload route as specified in cloud_implementation.md
router.post('/upload-image', uploadPostImage);

module.exports = router;
