const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  lineUserId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  pictureUrl: { type: String },
  email: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
