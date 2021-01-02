const { Pool } = require('pg');

const { config } = require('../config');

const client = new Pool(config.db);

async function testConnection() {
  try {
    console.log('Hello from pg testConnection');
    await client.query('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function close() {
  console.log('INFO: Closing pg DB wrapper');
  client.end();
}

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  try {
    if (!type) {
      throw new Error('ERROR: No product type defined');
    }
    if (!color) {
      throw new Error('ERROR: No product color defined');
    }
    const timestamp = new Date();

    const res = await client.query(
      'INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [type, color, price, quantity, timestamp, timestamp, null],
    );

    console.log(`DEBUG: New product created: ${JSON.stringify(res.rows[0])}`);
    return res.rows[0];
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
    const res = await client.query('SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL', [
      id,
    ]);

    return res.rows[0];
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
    const query = [];
    const values = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, [key, value]] of Object.entries(product).entries()) {
      query.push(`${key} = $${index + 1}`);
      values.push(value);
    }

    if (!values.length) {
      throw new Error('ERROR: Nothing to update');
    }

    values.push(id);

    const res = await client.query(
      `UPDATE products SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    console.log(`DEBUG: Product updated: ${JSON.stringify(res.rows[0])}`);
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined');
    }
    // await client.query('DELETE FROM products WHERE id = $1', [id]);
    await client.query('UPDATE products SET deleted_at = $1 WHERE id = $2', [new Date(), id]);
    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = {
  testConnection,
  close,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
