require('dotenv').config();
const { closeProgram } = require('./closeProgram');

const config = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: process.env.UPLOAD_DIR || closeProgram('No upload dir'),
  optimizedDir: process.env.OPTIMIZED_DIR || closeProgram('No optimized dir'),
};

const user = {
  name: process.env.USER_NAME || closeProgram('Invalid name'),
  password: process.env.PASSWORD || closeProgram('Invalid password'),
};

module.exports = {
  config,
  user,
};
