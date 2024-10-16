const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Seller schema
const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    submit: { type: String, required: true},
  });
  

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
