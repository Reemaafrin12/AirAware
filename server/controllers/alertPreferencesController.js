const AlertPreference = require('../models/AlertPreference');

function serializePreferences(preferences) {
  if (!preferences) {
    return null;
  }

  return {
    threshold: preferences.threshold,
    dailyAdvisory: preferences.dailyAdvisory,
    pushNotifications: preferences.pushNotifications,
    units: preferences.units,
  };
}

async function getAlertPreferences(_request, response) {
  response.json({ data: serializePreferences(await AlertPreference.findOne()) });
}

async function updateAlertPreferences(request, response) {
  const alertPreferences = await AlertPreference.findOneAndUpdate({}, {
    threshold: request.body.threshold,
    dailyAdvisory: request.body.dailyAdvisory,
    pushNotifications: request.body.pushNotifications,
    units: request.body.units,
  }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  response.json({ data: serializePreferences(alertPreferences) });
}

module.exports = { getAlertPreferences, updateAlertPreferences };
