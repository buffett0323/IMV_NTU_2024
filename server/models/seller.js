const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
