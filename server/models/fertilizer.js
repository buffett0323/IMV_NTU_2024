const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Fertilizer schema
const fertilizerSchema = new Schema({
  username: { type: String, required: true },  // Seller's username
  order_time: { type: Date, required: true },  // Time of the order
  fertilizer_amount: { type: Number, required: true },  // Amount of fertilizer packages
  olivine_amount: { type: Number, required: true },  // Amount of olivine packages
  total_amount: { type: Number, required: true },  // Total order amount in NTD
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);

