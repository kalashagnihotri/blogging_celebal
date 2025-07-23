const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await User.countDocuments();

  const users = await User.find()
    .select('-password')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
const updateUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Make sure user is updating their own profile or is admin
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this user', 403));
  }

  // Fields that can be updated
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
  };

  // Only admin can update role and isActive status
  if (req.user.role === 'admin') {
    if (req.body.role) fieldsToUpdate.role = req.body.role;
    if (typeof req.body.isActive !== 'undefined') fieldsToUpdate.isActive = req.body.isActive;
  }

  user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Prevent admin from deleting themselves
  if (req.params.id === req.user.id) {
    return next(new ErrorResponse('Cannot delete your own account', 400));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Upload avatar
// @route   POST /api/v1/users/:id/avatar
// @access  Private
const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Make sure user is updating their own profile or is admin
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this user', 403));
  }

  if (!req.filePath) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { avatar: req.filePath },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};
