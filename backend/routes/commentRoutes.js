const express = require('express');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentController');
const { authenticateToken } = require('../middlewares/auth');
const {
  validateComment,
  validateObjectId,
  validatePagination,
} = require('../middlewares/validation');

const router = express.Router();

// Public routes
router.get('/post/:postId', validateObjectId('postId'), validatePagination, getComments);

// Protected routes
router.post(
  '/post/:postId',
  authenticateToken,
  validateObjectId('postId'),
  validateComment,
  createComment
);

router.put(
  '/:id',
  authenticateToken,
  validateObjectId(),
  validateComment,
  updateComment
);

router.delete(
  '/:id',
  authenticateToken,
  validateObjectId(),
  deleteComment
);

router.post(
  '/:id/like',
  authenticateToken,
  validateObjectId(),
  likeComment
);

module.exports = router;
