const mongoose = require('mongoose');

const favoriteLocationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

module.exports = mongoose.model('FavoriteLocation', favoriteLocationSchema);
