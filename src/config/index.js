require('dotenv').config();
const { failedToLogIn } = require('./authorizeError');

const config = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: process.env.UPLOAD_DIR || process.exit(1),
  optimizedDir: process.env.OPTIMIZED_DIR || process.exit(1),
};

const user = {
  name: process.env.USER_NAME || failedToLogIn('Invalid name'),
  password: process.env.PASSWORD || failedToLogIn('Invalid password'),
};

module.exports = {
  config,
  user,
};
