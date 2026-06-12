const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Users',    required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);