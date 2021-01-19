const Knex = require('knex');

const { config } = require('../../config');
const { cryptoService } = require('../../services/cryptoService');
const { novaPoshtaService } = require('../../services/novaPoshtaService');
const { CsvAdapter } = require('../csvAdapter');
const { AdminsTable, ColorsTable, OrdersTable, TypesTable, ProductsTable } = require('./tables');

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

const adminsTable = new AdminsTable(knex, cryptoService);
const colorsTable = new ColorsTable(knex);
const typesTable = new TypesTable(knex);
const productsTable = new ProductsTable(knex, colorsTable, typesTable);
const ordersTable = new OrdersTable(knex, productsTable, novaPoshtaService);
const csvAdapter = new CsvAdapter(productsTable, colorsTable, typesTable);

module.exports = {
  testConnection,
  adminsTable,
  colorsTable,
  csvAdapter,
  ordersTable,
  productsTable,
  typesTable,
};
