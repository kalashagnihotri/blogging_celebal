const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please add comment content'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: true,
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

// Create indexes for performance
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ createdAt: -1 });

// Update likes count when likes array changes
commentSchema.pre('save', function (next) {
  this.likesCount = this.likes.length;
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
