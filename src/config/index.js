require('dotenv').config();
const { closeProgram } = require('./closeProgram');

const config = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: process.env.UPLOAD_DIR || closeProgram('No upload dir'),
  optimizedDir: process.env.OPTIMIZED_DIR || closeProgram('No optimized dir'),
  hash_secret: process.env.HASH_SECRET || closeProgram('HASH_SECRET is required'),
  refresh_token_key: process.env.REFRESH_TOKEN_KEY || closeProgram('REFRESH_TOKEN_KEY is required'),
  refresh_token_life:
    process.env.REFRESH_TOKEN_LIFE || closeProgram('REFRESH_TOKEN_LIFE is required'),
  access_token_key: process.env.ACCESS_TOKEN_KEY || closeProgram('ACCESS_TOKEN_KEY is required'),
  access_token_life: process.env.ACCESS_TOKEN_LIFE || closeProgram('ACCESS_TOKEN_LIFE is required'),

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
        debug: process.env.KNEX_DEBUG === 'true',
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
