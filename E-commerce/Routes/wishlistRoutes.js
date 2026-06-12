const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');

router.get('/:userId', getWishlist);
router.get('/:userId/:productId', checkWishlist);
router.post('/', addToWishlist);
router.delete('/:userId/:productId', removeFromWishlist);

module.exports = router;