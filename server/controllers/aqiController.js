const AQIReading = require('../models/AQIReading');

const healthAdvisories = {
  Good: [
    'Enjoy normal outdoor activities.',
    'Open windows for fresh indoor air when comfortable.',
    'Maintain regular exercise and hydration routines.',
  ],
  Moderate: [
    'Most people can continue normal outdoor activities.',
    'Sensitive individuals should reduce prolonged heavy exertion outdoors.',
    'Consider checking the AQI again before extended outdoor exercise.',
  ],
  Unhealthy: [
    'Limit prolonged or heavy outdoor exertion.',
    'Children, older adults, and people with heart or lung conditions should stay indoors when possible.',
    'Keep windows closed and use clean indoor air where available.',
    'Wear a well-fitted particulate mask if outdoor travel is necessary.',
  ],
};

function getCategory(aqiValue) {
  if (aqiValue <= 50) return 'Good';
  if (aqiValue <= 100) return 'Moderate';
  return 'Unhealthy';
}

async function getAqiReadings(_request, response) {
  const readings = await AQIReading.find().sort({ recordedAt: -1 });
  const aqiReadings = readings.map((reading) => ({
    locationId: reading.locationId ? reading.locationId.toString() : reading.stationId,
    aqi: reading.aqiValue,
    category: getCategory(reading.aqiValue),
    measuredAt: reading.recordedAt.toISOString(),
  }));
  response.json({ data: aqiReadings, healthAdvisories });
}

module.exports = { getAqiReadings };
