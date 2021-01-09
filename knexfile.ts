import * as dotenv from 'dotenv';
import { config } from './src/config';

dotenv.config({ path: `${process.env.PWD}/.env` });

export default {
  development: config.db.config.knex,
};