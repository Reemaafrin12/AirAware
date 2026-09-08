function requestLogger(request, _response, next) {
  console.log(`${new Date().toISOString()} ${request.method} ${request.path}`);
  next();
}

module.exports = { requestLogger };
