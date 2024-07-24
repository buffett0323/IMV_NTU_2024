// 生產者名稱、生產者ID、生產地點(如臺大農場)、淨重量(g)、農藥檢測紀錄
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    price: Number,
    lineUserName: String, //生產者名字
    lineUserId: String, //生產者id
    farmPlace: String,
    netWeight: Number, // unit: (g)
    pesticideRecord: String,
    productId: { type: String, unique: true }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
