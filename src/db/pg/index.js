const { Pool } = require('pg');

const { config } = require('../../config');

const client = new Pool(config.db.config.pg);
const name = 'pg';

async function createTable() {
  try {
    await client.query(`CREATE SEQUENCE IF NOT EXISTS products_id_seq START 1; CREATE TABLE IF NOT EXISTS "public"."products" (
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
    await client.query('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function close() {
  console.log(`INFO: Closing ${name} DB wrapper`);
  client.end();
}

async function createNewProduct({ type, color, price = 0, quantity = 1 }) {
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
    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  const res = await client.query(
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
    // await client.query('DELETE FROM products WHERE id = $1', [id]);
    await client.query('UPDATE products SET deleted_at = $1 WHERE id = $2', [new Date(), id]);
    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await client.query('SELECT * FROM products WHERE deleted_at IS NULL');
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
