const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// @desc    Get comments for a post
// @route   GET /api/v1/comments/post/:postId
// @access  Public
const getComments = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Get top-level comments
  const comments = await Comment.find({ 
    post: req.params.postId, 
    parent: null,
    isApproved: true 
  })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'author',
      select: 'name avatar',
    });

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({ 
        parent: comment._id,
        isApproved: true 
      })
        .sort('createdAt')
        .populate({
          path: 'author',
          select: 'name avatar',
        });

      return {
        ...comment.toObject(),
        replies,
      };
    })
  );

  const total = await Comment.countDocuments({ 
    post: req.params.postId, 
    parent: null,
    isApproved: true 
  });

  res.status(200).json({
    success: true,
    count: comments.length,
    total,
    data: commentsWithReplies,
  });
});

// @desc    Create new comment
// @route   POST /api/v1/comments/post/:postId
// @access  Private
const createComment = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Add user and post to req.body
  req.body.author = req.user.id;
  req.body.post = req.params.postId;

  // Check if parent comment exists (for replies)
  if (req.body.parent) {
    const parentComment = await Comment.findById(req.body.parent);
    if (!parentComment) {
      return next(new ErrorResponse('Parent comment not found', 404));
    }
  }

  const comment = await Comment.create(req.body);

  // Populate author
  await comment.populate({
    path: 'author',
    select: 'name avatar',
  });

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc    Update comment
// @route   PUT /api/v1/comments/:id
// @access  Private
const updateComment = catchAsyncErrors(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this comment', 403));
  }

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: 'author',
    select: 'name avatar',
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
const deleteComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this comment', 403));
  }

  // Delete all replies to this comment
  await Comment.deleteMany({ parent: comment._id });

  // Delete the comment
  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

// @desc    Like/Unlike comment
// @route   POST /api/v1/comments/:id/like
// @access  Private
const likeComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  const userId = req.user.id;
  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    // Unlike comment
    comment.likes = comment.likes.filter(id => id.toString() !== userId);
  } else {
    // Like comment
    comment.likes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    data: {
      liked: !isLiked,
      likesCount: comment.likesCount,
    },
  });
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
