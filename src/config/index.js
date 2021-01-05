require('dotenv').config();
const { closeProgram } = require('./closeProgram');

const config = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: process.env.UPLOAD_DIR || closeProgram('No upload dir'),
  optimizedDir: process.env.OPTIMIZED_DIR || closeProgram('No optimized dir'),

  db: {
    config: {
      knex: {
        client: 'postgresql',
        connection: {
          user: process.env.DB_USER || closeProgram('CLOSED: DB_USER is not defined'),
          host: process.env.DB_HOST || closeProgram('CLOSED: DB_HOST is not defined'),
          port: process.env.DB_PORT || closeProgram('CLOSED: DB_PORT is not defined'),
          database: process.env.DB_NAME || closeProgram('CLOSED: DB_NAME is not defined'),
          password: process.env.DB_PASS || closeProgram('CLOSED: DB_PASS is not defined'),
        },
        pool: {
          min: 2,
          max: 10,
        },
        debug: true,
      },
    },
  },
};

const user = {
  name: process.env.USER_NAME || closeProgram('Invalid name'),
  password: process.env.PASSWORD || closeProgram('Invalid password'),
};

module.exports = {
  config,
  user,
  closeProgram,
};
