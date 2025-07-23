const express = require('express');
const { uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

// User profile upload route as specified in cloud_implementation.md
router.post('/upload-profile', uploadAvatar);

module.exports = router;
