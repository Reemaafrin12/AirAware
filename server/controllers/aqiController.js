const { aqiReadings, healthAdvisories } = require('../config/sampleData');

function getAqiReadings(_request, response) {
  response.json({ data: aqiReadings, healthAdvisories });
}

module.exports = { getAqiReadings };
