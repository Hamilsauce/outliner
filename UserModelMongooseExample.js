const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);