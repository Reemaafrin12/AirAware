const User = require('../models/User');

function serializeProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    id: profile._id.toString(),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    healthSensitivity: profile.healthSensitivity,
    preferredLocationId: profile.preferredLocationId,
  };
}

async function getProfile(_request, response) {
  response.json({ data: serializeProfile(await User.findOne()) });
}

async function updateProfile(request, response) {
  const profile = await User.findOneAndUpdate({}, {
    name: request.body.name,
    email: request.body.email,
    phone: request.body.phone,
    address: request.body.address,
    healthSensitivity: request.body.healthSensitivity,
  }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  response.json({ data: serializeProfile(profile) });
}

module.exports = { getProfile, updateProfile };
