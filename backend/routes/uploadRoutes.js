const express = require('express');
const { uploadAvatar, uploadPostImage } = require('../controllers/uploadController');

const router = express.Router();

// Upload routes
router.post('/avatar', uploadAvatar);
router.post('/post', uploadPostImage);

module.exports = router;
