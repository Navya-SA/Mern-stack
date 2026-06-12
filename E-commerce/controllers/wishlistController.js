const Wishlist = require('../model/wishlistSchema');

// GET /wishlist/:userId
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.params.userId })
      .populate('productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ wishlist: items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err.message });
  }
};

// POST /wishlist  { userId, productId }
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const item = new Wishlist({ userId, productId });
    await item.save();
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    // Duplicate key = already wishlisted
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Already in wishlist' });
    }
    res.status(500).json({ message: 'Failed to add to wishlist', error: err.message });
  }
};

// DELETE /wishlist/:userId/:productId
const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: err.message });
  }
};

// GET /wishlist/:userId/:productId — check if a single product is wishlisted
const checkWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    res.status(200).json({ wishlisted: !!item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check wishlist', error: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };