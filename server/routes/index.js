const express = require('express');

const {
  getAlertPreferences,
  updateAlertPreferences,
} = require('../controllers/alertPreferencesController');
const { getAqiReadings } = require('../controllers/aqiController');
const { getHealth } = require('../controllers/healthController');
const {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} = require('../controllers/locationController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { requireFields } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getHealth);
router.get('/locations', getLocations);
router.post('/locations', requireFields(['name', 'city', 'lat', 'lng']), createLocation);
router.put('/locations/:id', requireFields(['name', 'city', 'lat', 'lng']), updateLocation);
router.delete('/locations/:id', deleteLocation);
router.get('/aqi', getAqiReadings);
router.get('/profile', getProfile);
router.put(
  '/profile',
  requireFields(['name', 'email', 'phone', 'address', 'healthSensitivity']),
  updateProfile,
);
router.get('/alert-preferences', getAlertPreferences);
router.put(
  '/alert-preferences',
  requireFields(['threshold', 'dailyAdvisory', 'pushNotifications', 'units']),
  updateAlertPreferences,
);

module.exports = router;
