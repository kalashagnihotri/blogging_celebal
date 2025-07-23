const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// Protect routes - authenticate token
const authenticateToken = catchAsyncErrors(async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('No user found with this token', 404));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is owner or admin
const checkOwnership = (resourceKey = 'author') => {
  return (req, res, next) => {
    const resourceId = req.resource ? req.resource[resourceKey] : null;
    
    if (!resourceId) {
      return next(new ErrorResponse('Resource not found', 404));
    }

    if (req.user.role === 'admin' || req.user._id.toString() === resourceId.toString()) {
      return next();
    }

    return next(new ErrorResponse('Not authorized to access this resource', 403));
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkOwnership,
};
