const { locations } = require('../config/sampleData');

function getLocations(_request, response) {
  response.json({ data: locations });
}

function createLocation(request, response) {
  const location = {
    id: `location-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: request.body.name,
    city: request.body.city,
    lat: request.body.lat,
    lng: request.body.lng,
  };

  locations.push(location);
  response.status(201).json({ data: location });
}

function updateLocation(request, response) {
  const location = locations.find((item) => item.id === request.params.id);
  if (!location) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }

  Object.assign(location, {
    name: request.body.name,
    city: request.body.city,
    lat: request.body.lat,
    lng: request.body.lng,
  });
  response.json({ data: location });
}

function deleteLocation(request, response) {
  const locationIndex = locations.findIndex((item) => item.id === request.params.id);
  if (locationIndex === -1) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }

  locations.splice(locationIndex, 1);
  response.status(204).send();
}

module.exports = { createLocation, deleteLocation, getLocations, updateLocation };
