const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQty, removeFromCart, clearCart } = require('../controllers/cartController');

router.post('/add', addToCart);
router.patch('/update', updateQty);
router.get('/:userId', getCart);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', clearCart);

module.exports = router;