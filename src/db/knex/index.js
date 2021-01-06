const Knex = require('knex');

const { config } = require('../../config');
const { ColorsTable, TypesTable, ProductsTable } = require('./tables');

/**
 * @type Knex - Knex client
 */
const knex = new Knex(config.db.config.knex);

async function testConnection() {
  try {
    console.log(`Hello from knex testConnection`);
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const colorsTable = new ColorsTable(knex);
const typesTable = new TypesTable(knex);
const productsTable = new ProductsTable(knex, colorsTable, typesTable);

module.exports = {
  testConnection,
  colorsTable,
  typesTable,
  productsTable,
};
