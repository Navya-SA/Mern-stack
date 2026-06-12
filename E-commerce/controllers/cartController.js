const Cart = require('../model/cartSchema');

// GET /cart/:userId
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.status(200).json({ cart: cart?.items || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// POST /cart/add  { userId, productId }
const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const existing = cart.items.find(i => i.productId.toString() === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

// PATCH /cart/update  { userId, productId, quantity }
const updateQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

// DELETE /cart/:userId/:productId
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

// DELETE /cart/:userId
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.params.userId }, { items: [] });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};

module.exports = { getCart, addToCart, updateQty, removeFromCart, clearCart };