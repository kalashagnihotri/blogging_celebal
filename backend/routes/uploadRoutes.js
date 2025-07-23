const express = require('express');
const { uploadAvatar, uploadPostImage, deleteImage } = require('../controllers/uploadController');

const router = express.Router();

// Upload routes
router.post('/avatar', uploadAvatar);
router.post('/post', uploadPostImage);

// Delete route
router.delete('/:publicId', deleteImage);

module.exports = router;
