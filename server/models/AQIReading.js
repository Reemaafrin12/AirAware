const mongoose = require('mongoose');

const aqiReadingSchema = new mongoose.Schema(
  {
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'FavoriteLocation' },
    stationId: { type: String, trim: true },
    aqiValue: { type: Number, required: true },
    pollutants: { pm25: Number, pm10: Number, ozone: Number, no2: Number },
    recordedAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false },
);

aqiReadingSchema.pre('validate', function validateSource() {
  if (!this.locationId && !this.stationId) {
    throw new Error('AQIReading requires either locationId or stationId.');
  }
});

module.exports = mongoose.model('AQIReading', aqiReadingSchema);
