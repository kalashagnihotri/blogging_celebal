const { body, param, query, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');

// Handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors,
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Post validation rules
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('category')
    .isIn(['tech', 'life', 'travel', 'food', 'business', 'health', 'other'])
    .withMessage('Please select a valid category'),
  body('tags')
    .optional()
    .customSanitizer((value) => {
      // Handle comma-separated string from FormData
      if (typeof value === 'string') {
        return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      // Handle array directly (for JSON requests)
      if (Array.isArray(value)) {
        return value;
      }
      return [];
    })
    .isArray()
    .withMessage('Tags must be an array'),
  body('excerpt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Excerpt cannot be more than 200 characters'),
  handleValidationErrors,
];

// Comment validation rules
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

// Search validation
const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  query('category')
    .optional()
    .isIn(['tech', 'life', 'travel', 'food', 'business', 'health', 'other'])
    .withMessage('Invalid category'),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePost,
  validateComment,
  validateObjectId,
  validatePagination,
  validateSearch,
  handleValidationErrors,
};
