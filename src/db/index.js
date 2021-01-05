const { closeProgram } = require('../config');
const knexDb = require('./knex');

async function init() {
  try {
    await knexDb.testConnection();
  } catch (err) {
    closeProgram(`FATAL: ${err.message || err}`, err);
  }
}

module.exports = {
  init,
  ...knexDb,
};
