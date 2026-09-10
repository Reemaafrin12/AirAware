const { userProfiles } = require('../config/sampleData');

function getProfile(_request, response) {
  response.json({ data: userProfiles[0] });
}

function updateProfile(request, response) {
  const profile = userProfiles[0];
  Object.assign(profile, {
    name: request.body.name,
    email: request.body.email,
    phone: request.body.phone,
    address: request.body.address,
    healthSensitivity: request.body.healthSensitivity,
  });
  response.json({ data: profile });
}

module.exports = { getProfile, updateProfile };
