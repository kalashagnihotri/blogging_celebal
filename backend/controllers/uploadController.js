const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middlewares/auth');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ErrorResponse('Only image files are allowed', 400), false);
    }
  }
});

// @desc    Upload avatar
// @route   POST /api/v1/upload/avatar
// @access  Private
const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  // Generate URL for the uploaded file
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL || 'https://your-domain.com'
    : `http://localhost:${process.env.PORT || 5001}`;
  
  const fileUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    }
  });
});

// @desc    Upload post image
// @route   POST /api/v1/upload/post
// @access  Private
const uploadPostImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const postUploadDir = path.join(__dirname, '../uploads/posts');
  if (!fs.existsSync(postUploadDir)) {
    fs.mkdirSync(postUploadDir, { recursive: true });
  }

  // Generate URL for the uploaded file
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL || 'https://your-domain.com'
    : `http://localhost:${process.env.PORT || 5001}`;
  
  const fileUrl = `${baseUrl}/uploads/posts/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    }
  });
});

const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const postUploadDir = path.join(__dirname, '../uploads/posts');
    cb(null, postUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPostImageMulter = multer({
  storage: postImageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for posts
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ErrorResponse('Only image files are allowed', 400), false);
    }
  }
});

module.exports = {
  uploadAvatar: [authenticateToken, upload.single('image'), uploadAvatar],
  uploadPostImage: [authenticateToken, uploadPostImageMulter.single('image'), uploadPostImage]
};
