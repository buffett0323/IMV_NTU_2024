const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  lineUserId: { type: String, required: true },
  displayName: String,
  pictureUrl: String,
  email: String,
  deliveryAddress: String, // 配送地址
  premiereLevel: Number, // 分等級制
});

const User = mongoose.model('User', userSchema);
module.exports = User;
