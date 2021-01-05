const Knex = require('knex');

const { config } = require('../../config');
const { ProductsTable } = require('./products');

const name = 'knex';
/**
 * @type Knex - Knex client
 */
const knex = new Knex(config.db.config.knex);

async function testConnection() {
  try {
    console.log(`Hello from ${name} testConnection`);
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

const productsTable = new ProductsTable(knex);

module.exports = {
  testConnection,
  productsTable,
};
