const { alertPreferences } = require('../config/sampleData');

function getAlertPreferences(_request, response) {
  response.json({ data: alertPreferences });
}

function updateAlertPreferences(request, response) {
  Object.assign(alertPreferences, {
    threshold: request.body.threshold,
    dailyAdvisory: request.body.dailyAdvisory,
    pushNotifications: request.body.pushNotifications,
    units: request.body.units,
  });
  response.json({ data: alertPreferences });
}

module.exports = { getAlertPreferences, updateAlertPreferences };
