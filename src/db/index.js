const { closeProgram } = require('../config');
const knexDb = require('./knex');

async function init() {
  try {
    await knexDb.testConnection();
  } catch (err) {
    closeProgram(`FATAL: ${err.message || err}`, err);
  }
}

async function end() {
  await knexDb.close();
  console.log(`INFO: DB wrapper for knex was closed`);
}

module.exports = {
  init,
  end,
  ...knexDb,
};
