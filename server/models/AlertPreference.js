const mongoose = require('mongoose');

const alertPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, default: null },
    threshold: { type: Number, required: true },
    dailyAdvisory: { type: Boolean, required: true },
    pushNotifications: { type: Boolean, required: true },
    units: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } },
);

module.exports = mongoose.model('AlertPreference', alertPreferenceSchema);
