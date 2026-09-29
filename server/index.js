const express = require('express');

const { connectDatabase } = require('./config/db');
const { port } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const { requestLogger } = require('./middleware/requestLogger');
const routes = require('./routes');

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`AirAware API listening on http://localhost:${port}`);
  });
}

startServer();
