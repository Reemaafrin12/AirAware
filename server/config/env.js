const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);

module.exports = {
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000,
};
