const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Users',    required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity:  { type: Number, default: 1, min: 1 },
    status:    { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);