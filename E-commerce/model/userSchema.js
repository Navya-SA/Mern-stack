const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  password:  { type: String, required: true },
  PhoneNo:   { type: Number, required: true },
  email:     { type: String, required: true },
  address:   { type: String, required: true },
  isAdmin:   { type: Boolean, default: false },   // ← new
});

const User = mongoose.model('Users', UserSchema);
module.exports = User;