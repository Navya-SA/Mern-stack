const Order = require("../model/orderSchema");

const createOrder = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const newOrder = new Order({
      userId,
      productId,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to place order",
      error: err.message,
    });
  }
};

module.exports = { createOrder };