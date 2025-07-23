const Post = require('../models/Post');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
const getPosts = catchAsyncErrors(async (req, res, next) => {
  let query = {};

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Build query filters
  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  if (req.query.author) {
    query.author = req.query.author;
  }

  // Only show published posts to public
  query.published = true;

  // Create query
  let queryStr = Post.find(query);

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    queryStr = queryStr.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryStr = queryStr.sort(sortBy);
  } else if (req.query.search) {
    queryStr = queryStr.sort({ score: { $meta: 'textScore' } });
  } else {
    queryStr = queryStr.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments(query);

  queryStr = queryStr.skip(startIndex).limit(limit);

  // Populate author
  queryStr = queryStr.populate({
    path: 'author',
    select: 'name avatar',
  });

  // Execute query
  const posts = await queryStr;

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
    count: posts.length,
    total,
    pagination,
    data: posts,
  });
});

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
const getPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'author',
    select: 'name avatar bio',
  });

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
const createPost = catchAsyncErrors(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;

  // Add image if uploaded
  if (req.filePath) {
    req.body.image = req.filePath;
  }

  const post = await Post.create(req.body);

  // Populate author
  await post.populate({
    path: 'author',
    select: 'name avatar',
  });

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
const updatePost = catchAsyncErrors(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this post', 403));
  }

  // Add image if uploaded
  if (req.filePath) {
    req.body.image = req.filePath;
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'author',
    select: 'name avatar',
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
const deletePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this post', 403));
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});

// @desc    Like/Unlike post
// @route   POST /api/v1/posts/:id/like
// @access  Private
const likePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const userId = req.user.id;
  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Unlike post
    post.likes = post.likes.filter(id => id.toString() !== userId);
  } else {
    // Like post
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: {
      liked: !isLiked,
      likesCount: post.likesCount,
    },
  });
});

// @desc    Get posts by user
// @route   GET /api/v1/posts/user/:userId
// @access  Public
const getPostsByUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const posts = await Post.find({ 
    author: req.params.userId, 
    published: true 
  })
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'name avatar',
    });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc    Get featured posts
// @route   GET /api/v1/posts/featured
// @access  Public
const getFeaturedPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ 
    featured: true, 
    published: true 
  })
    .sort('-createdAt')
    .limit(5)
    .populate({
      path: 'author',
      select: 'name avatar',
    });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc    Get current user's posts
// @route   GET /api/v1/posts/my-posts
// @access  Private
const getMyPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ author: req.user.id })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsByUser,
  getFeaturedPosts,
  getMyPosts,
};
