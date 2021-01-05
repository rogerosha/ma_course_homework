const Knex = require('knex');

const { config } = require('../../config');

const name = 'knex';
/**
 * @type Knex
 */
const knex = new Knex(config.db.config.knex);

async function createTable() {
  try {
    await knex.schema.createTable('products', (table) => {
      table.increments();
      table.string('type').notNullable();
      table.string('color').notNullable();
      table.integer('quantity').notNullable();
      table.decimal('price').notNullable();
      table.timestamps(false, true);
      table.timestamp('deleted_at');
    });
    console.log('The table has been created');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function testConnection() {
  try {
    console.log(`Hello from ${name} testConnection`);
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function close() {
  console.log(`INFO: Closing ${name} DB wrapper`);
  // no close for knex
}

async function createNewProduct(product) {
  try {
    if (!product.type) {
      throw new Error('ERROR: No product type defined');
    }
    if (!product.color) {
      throw new Error('ERROR: No product color defined');
    }
    const p = JSON.parse(JSON.stringify(product));
    const timestamp = new Date();

    delete p.id;
    p.price = p.price || 0;
    p.quantity = p.quantity || 0;
    p.created_at = timestamp;
    p.updated_at = timestamp;

    const res = knex('products').insert(p).returning('*');

    console.log(`DEBUG: New product created: ${JSON.stringify(res[0])}`);
    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined');
    }
    const res = knex('products').where('id', id).whereNull('deleted_at');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined');
    }

    if (!Object.keys(product).length) {
      throw new Error('ERROR: Nothing to update');
    }
    const p = JSON.parse(JSON.stringify(product));
    const res = await knex('products').update(p).where('id', id).returning('*');
    console.log(`DEBUG: Product updated: ${JSON.stringify(res[0])}`);
    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createProduct(requestProduct) {
  const res = await knex('products')
    .where({
      type: requestProduct.type,
      color: requestProduct.color,
      price: requestProduct.price,
    })
    .whereNull('deleted_at');
  const product = res[0];
  if (product) {
    return updateProduct({ ...product, quantity: product.quantity + 1 });
  }
  return createNewProduct(requestProduct);
}

async function deleteProduct(id) {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined');
    }
    // await knex('products').where('id', id).del();
    await knex('products').where('id', id).update('deleted_at', new Date());

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await knex('products').whereNull('deleted_at');
    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = {
  createTable,
  testConnection,
  close,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
