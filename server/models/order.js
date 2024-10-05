const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: String,
  productId: String,
  productName: String,
  productPrice: Number,
  productOwnerID: String,
  quantity: Number,
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;