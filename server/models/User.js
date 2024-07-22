const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  lineUserId: { type: String, required: true },
  displayName: String,
  pictureUrl: String,
  statusMessage: String, // 個性簽名
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
