function getHealth(_request, response) {
  response.json({
    message: 'Welcome to the AirAware API.',
    status: 'ok',
  });
}

module.exports = { getHealth };
