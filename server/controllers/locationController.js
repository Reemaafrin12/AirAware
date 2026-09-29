const FavoriteLocation = require('../models/FavoriteLocation');
const mongoose = require('mongoose');

function serializeLocation(location) {
  return {
    id: location._id.toString(),
    name: location.name,
    city: location.city,
    lat: location.lat,
    lng: location.lng,
  };
}

async function getLocations(_request, response) {
  const locations = await FavoriteLocation.find().sort({ createdAt: 1 });
  response.json({ data: locations.map(serializeLocation) });
}

async function createLocation(request, response) {
  const location = await FavoriteLocation.create({
    name: request.body.name,
    city: request.body.city,
    lat: request.body.lat,
    lng: request.body.lng,
  });

  response.status(201).json({ data: serializeLocation(location) });
}

async function updateLocation(request, response) {
  if (!mongoose.isObjectIdOrHexString(request.params.id)) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }
  const location = await FavoriteLocation.findByIdAndUpdate(
    request.params.id,
    { name: request.body.name, city: request.body.city, lat: request.body.lat, lng: request.body.lng },
    { new: true, runValidators: true },
  );
  if (!location) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }

  response.json({ data: serializeLocation(location) });
}

async function deleteLocation(request, response) {
  if (!mongoose.isObjectIdOrHexString(request.params.id)) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }
  const location = await FavoriteLocation.findByIdAndDelete(request.params.id);
  if (!location) {
    response.status(404).json({
      error: { code: 'LOCATION_NOT_FOUND', message: 'Location was not found.' },
    });
    return;
  }
  response.status(204).send();
}

module.exports = { createLocation, deleteLocation, getLocations, updateLocation };
