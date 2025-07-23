const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['tech', 'life', 'travel', 'food', 'business', 'health', 'other'],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    image: {
      type: String,
      default: 'default-post.jpg',
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
postSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  tags: 'text' 
});

// Create other indexes for performance
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ published: 1 });
postSchema.index({ createdAt: -1 });

// Auto-generate excerpt from content if not provided
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  }
  next();
});

// Update likes count when likes array changes
postSchema.pre('save', function (next) {
  this.likesCount = this.likes.length;
  next();
});

module.exports = mongoose.model('Post', postSchema);
