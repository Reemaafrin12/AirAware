const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    healthSensitivity: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    preferredLocationId: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

module.exports = mongoose.model('User', userSchema);
