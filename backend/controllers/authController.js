const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { sendTokenResponse } = require('../utils/tokenUtils');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
const updateDetails = catchAsyncErrors(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshToken = catchAsyncErrors(async (req, res, next) => {
  const { refreshToken } = req.body || req.cookies;

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token not provided', 401));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('No user found with this token', 404));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse('Invalid refresh token', 401));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  refreshToken,
  logout,
};
