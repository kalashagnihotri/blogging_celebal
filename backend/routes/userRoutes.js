const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  getMyStats,
} = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { uploadSingleImage } = require('../middlewares/upload');
const {
  validateObjectId,
  validatePagination,
} = require('../middlewares/validation');

const router = express.Router();

// Admin only routes
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validatePagination,
  getAllUsers
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validateObjectId(),
  deleteUser
);

// Protected routes
router.get('/stats', authenticateToken, getMyStats);

router.get(
  '/:id',
  authenticateToken,
  validateObjectId(),
  getUser
);

router.put(
  '/:id',
  authenticateToken,
  validateObjectId(),
  updateUser
);

router.post(
  '/:id/avatar',
  authenticateToken,
  validateObjectId(),
  uploadSingleImage('avatar'),
  uploadAvatar
);

module.exports = router;
