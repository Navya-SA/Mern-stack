const Order = require('../model/orderSchema');

const createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    const newOrder = new Order({ userId, productId, quantity });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

module.exports = { createOrder, getOrdersByUser, updateOrderStatus };