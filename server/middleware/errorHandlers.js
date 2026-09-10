function notFoundHandler(request, response) {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${request.method} ${request.path} was not found.`,
    },
  });
}

function errorHandler(error, _request, response, _next) {
  console.error('Unhandled API error:', error);
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    response.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON.',
      },
    });
    return;
  }

  response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred.',
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
