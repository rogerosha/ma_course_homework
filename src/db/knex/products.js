// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

class ProductsTable {
  /**
   * @param {Knex} knex - Knex client
   */
  constructor(knex) {
    this.knex = knex;

    this.TABLE_NAME = 'products';
    this.DEFAULT_PRODUCT = {
      price: 0,
      quantity: 1,
    };
  }

  async createTable() {
    const isTableExists = await this.knex.schema.hasTable(this.TABLE_NAME);
    if (isTableExists) {
      console.log('The table is already created');
    } else {
      await this.knex.schema.createTable(this.TABLE_NAME, (table) => {
        table.increments();
        table.string('type').notNullable();
        table.string('color').notNullable();
        table.integer('quantity').notNullable().defaultTo(this.DEFAULT_PRODUCT.quantity);
        table.decimal('price').notNullable().defaultTo(this.DEFAULT_PRODUCT.price);
        table.timestamps(false, true);
        table.timestamp('deleted_at');
      });
      console.log('The table has been created');
    }
  }

  // Requests

  async createProduct(requestProduct) {
    const productsResult = await this.knex(this.TABLE_NAME)
      .where({
        type: requestProduct.type,
        color: requestProduct.color,
        price: requestProduct.price || this.DEFAULT_PRODUCT.price,
      })
      .whereNull('deleted_at');

    const foundProduct = productsResult[0];

    return foundProduct
      ? this.updateProduct({ ...foundProduct, quantity: foundProduct.quantity + 1 })
      : this.createNewProduct(requestProduct);
  }

  async updateProduct({ id, ...product }) {
    try {
      if (!id) {
        throw new Error('ERROR: No product id defined');
      }

      if (!Object.keys(product).length) {
        throw new Error('ERROR: Nothing to update');
      }

      const updateResult = await this.knex(this.TABLE_NAME)
        .update(product)
        .where('id', id)
        .returning('*');

      const updatedProduct = updateResult[0];

      console.log(`DEBUG: Product updated: ${JSON.stringify(updatedProduct)}`);
      return updatedProduct;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  async createNewProduct(product) {
    try {
      if (!product.type) {
        throw new Error('ERROR: No product type defined');
      }

      if (!product.color) {
        throw new Error('ERROR: No product color defined');
      }

      const productCopy = JSON.parse(JSON.stringify(product));
      delete productCopy.id;

      const createResult = await this.knex(this.TABLE_NAME).insert(productCopy).returning('*');
      const createdProduct = createResult[0];
      console.log(`DEBUG: New product created: ${JSON.stringify(createdProduct)}`);
      return createdProduct;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  async getProduct(id) {
    try {
      if (!id) {
        throw new Error('ERROR: No product id defined');
      }

      const foundResult = await this.knex(this.TABLE_NAME).where('id', id).whereNull('deleted_at');
      const foundProduct = foundResult[0];

      return foundProduct;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) {
        throw new Error('ERROR: No product id defined');
      }

      await this.knex(this.TABLE_NAME).where('id', id).update('deleted_at', new Date());

      return true;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  async getAllProducts() {
    try {
      const foundProducts = await this.knex(this.TABLE_NAME).whereNull('deleted_at');
      return foundProducts;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }
}

module.exports = {
  ProductsTable,
};
