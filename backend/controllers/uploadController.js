const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinaryConfig');
const { authenticateToken } = require('../middlewares/auth');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// Configure multer for temporary storage before Cloudinary upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename for temporary storage
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
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

const uploadPostImageMulter = multer({
  storage: storage, // Use same temporary storage
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

// @desc    Upload avatar
// @route   POST /api/v1/upload/avatar
// @access  Private
const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  try {
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path, 'avatars');

    if (!cloudinaryResult.success) {
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      return next(new ErrorResponse('Failed to upload image to cloud storage', 500));
    }

    // Update user's avatar in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        avatar: cloudinaryResult.url,
        avatarPublicId: cloudinaryResult.public_id
      },
      { new: true, runValidators: true }
    ).select('-password');

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      imageUrl: cloudinaryResult.url,
      data: {
        url: cloudinaryResult.url,
        user: user,
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
        },
      },
    });
  } catch (error) {
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorResponse('Upload failed', 500));
  }
});

// @desc    Upload post image
// @route   POST /api/v1/upload/post
// @access  Private
const uploadPostImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  try {
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path, 'posts');

    if (!cloudinaryResult.success) {
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      return next(new ErrorResponse('Failed to upload image to cloud storage', 500));
    }

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Post image uploaded successfully',
      imageUrl: cloudinaryResult.url,
      data: {
        url: cloudinaryResult.url,
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
        },
      },
    });
  } catch (error) {
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorResponse('Upload failed', 500));
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/:publicId
// @access  Private
const deleteImage = catchAsyncErrors(async (req, res, next) => {
  const { publicId } = req.params;

  if (!publicId) {
    return next(new ErrorResponse('Public ID is required', 400));
  }

  try {
    const result = await deleteFromCloudinary(publicId);

    if (!result.success) {
      return next(new ErrorResponse('Failed to delete image from cloud storage', 500));
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (error) {
    return next(new ErrorResponse('Delete failed', 500));
  }
});

module.exports = {
  uploadAvatar: [authenticateToken, upload.single('image'), uploadAvatar],
  uploadPostImage: [authenticateToken, uploadPostImageMulter.single('image'), uploadPostImage],
  deleteImage: [authenticateToken, deleteImage],
};
