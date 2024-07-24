const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    price: Number,
    lineUserId: String,
    productId: { type: String, unique: true }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
