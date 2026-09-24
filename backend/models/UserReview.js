const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review spam from same user on same product
userReviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('UserReview', userReviewSchema);
