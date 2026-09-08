const express = require('express');

const { getAqiReadings } = require('../controllers/aqiController');
const { getHealth } = require('../controllers/healthController');
const { getLocations } = require('../controllers/locationController');
const { getProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/', getHealth);
router.get('/locations', getLocations);
router.get('/aqi', getAqiReadings);
router.get('/profile', getProfile);

module.exports = router;
