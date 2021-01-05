const Knex = require('knex');

const { config } = require('../../config');

const name = 'knex';
const knex = new Knex(config);

async function createTable() {
  try {
    await knex.raw(`CREATE SEQUENCE IF NOT EXISTS products_id_seq START 1; CREATE TABLE IF NOT EXISTS "public"."products" (
      "type" character varying(255) NOT NULL,
      "color" character varying(255) NOT NULL,
      "quantity" integer NOT NULL,
      "price" numeric NOT NULL,
      "created_at" timestamptz,
      "updated_at" timestamptz,
      "deleted_at" timestamptz,
      "id" integer DEFAULT nextval('products_id_seq') NOT NULL
  ) WITH (oids = false)`);
    console.log('Table has been created');
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
    const res = knex('products').update(p).where('id', id).returning('*');
    console.log(`DEBUG: Product updated: ${JSON.stringify(res[0])}`);
    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  const res = await knex.raw(
    'SELECT * FROM products WHERE type = $1 AND color = $2 AND price = $3 AND deleted_at IS NULL',
    [type, color, price],
  );
  const product = res.rows[0];
  if (product) {
    return updateProduct({ ...product, quantity: product.quantity + 1 });
  }
  return createNewProduct({ type, color, price, quantity });
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
    const res = await knex.raw('SELECT * FROM products WHERE deleted_at IS NULL');
    return res.rows;
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
