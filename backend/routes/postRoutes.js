const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsByUser,
  getFeaturedPosts,
  getMyPosts,
} = require('../controllers/postController');
const { authenticateToken, authorizeRoles, checkOwnership } = require('../middlewares/auth');
const { uploadSingleImage } = require('../middlewares/upload');
const {
  validatePost,
  validateObjectId,
  validatePagination,
  validateSearch,
} = require('../middlewares/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, validateSearch, getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/user/:userId', validateObjectId('userId'), getPostsByUser);

// Protected routes - user's own posts (must come before /:id route)
router.get('/my-posts', authenticateToken, getMyPosts);

router.get('/:id', validateObjectId(), getPost);

// Protected routes
router.post(
  '/',
  authenticateToken,
  uploadSingleImage('image'),
  validatePost,
  createPost
);

router.put(
  '/:id',
  authenticateToken,
  validateObjectId(),
  uploadSingleImage('image'),
  validatePost,
  updatePost
);

router.delete(
  '/:id',
  authenticateToken,
  validateObjectId(),
  deletePost
);

router.post(
  '/:id/like',
  authenticateToken,
  validateObjectId(),
  likePost
);

module.exports = router;
