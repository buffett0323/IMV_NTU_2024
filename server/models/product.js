// 生產者名稱、生產者ID、生產地點(如臺大農場)、淨重量(g)、農藥檢測紀錄
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    lineUserName: { type: String, required: true }, // 生產者名字
    lineUserId: { type: String, required: true }, // 生產者id
    farmPlace: { type: String, required: true },
    netWeight: { type: Number, required: true }, // unit: (g)
    pesticideRecord: { type: String, required: true },
    productId: { type: String, unique: true },
    timestamp: { type: Date, default: Date.now },
    quantity: { type: Number, required: true},
    imageBase64: { type: String}, // Add this field to store the Base64 string// imageUrl: { type: String }, // Image URL
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
