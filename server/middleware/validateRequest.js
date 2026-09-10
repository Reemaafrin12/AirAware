function requireFields(fields) {
  return (request, response, next) => {
    if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
      response.status(400).json({
        error: { code: 'INVALID_REQUEST_BODY', message: 'A JSON request body is required.' },
      });
      return;
    }

    const missingFields = fields.filter((field) => {
      const value = request.body[field];
      return value === undefined || value === null || value === '';
    });
    if (missingFields.length > 0) {
      response.status(400).json({
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: `Missing required fields: ${missingFields.join(', ')}.`,
        },
      });
      return;
    }

    next();
  };
}

module.exports = { requireFields };
