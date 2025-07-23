const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_UPLOAD) || 2000000, // 2MB default
  },
  fileFilter: imageFilter,
});

// Middleware for single image upload
const uploadSingleImage = (fieldName = 'image') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ErrorResponse('File too large. Maximum size is 2MB', 400));
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ErrorResponse('Unexpected file field', 400));
          }
        }
        return next(err);
      }
      
      // Add file path to request if file was uploaded
      if (req.file) {
        req.filePath = req.file.filename;
      }
      
      next();
    });
  };
};

// Middleware for multiple image uploads
const uploadMultipleImages = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ErrorResponse('File too large. Maximum size is 2MB', 400));
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ErrorResponse('Too many files or unexpected file field', 400));
          }
        }
        return next(err);
      }
      
      // Add file paths to request if files were uploaded
      if (req.files && req.files.length > 0) {
        req.filePaths = req.files.map(file => file.filename);
      }
      
      next();
    });
  };
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};
