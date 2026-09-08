const { userProfiles } = require('../config/sampleData');

function getProfile(_request, response) {
  response.json({ data: userProfiles[0] });
}

module.exports = { getProfile };
