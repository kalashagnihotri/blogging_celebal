const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  refreshToken,
  logout,
} = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const {
  validateUserRegistration,
  validateUserLogin,
} = require('../middlewares/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/updatedetails', authenticateToken, updateDetails);
router.put('/updatepassword', authenticateToken, updatePassword);
router.post('/logout', authenticateToken, logout);

module.exports = router;
