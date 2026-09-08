const { locations } = require('../config/sampleData');

function getLocations(_request, response) {
  response.json({ data: locations });
}

module.exports = { getLocations };
