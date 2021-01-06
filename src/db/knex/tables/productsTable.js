/* eslint-disable no-unused-vars */
const Knex = require('knex');
const { ColorsTable } = require('./colorsTable');
const { TypesTable } = require('./typesTable');

class ProductsTable {
  /**
   * @param {Knex} knex - Knex client
   * @param {ColorsTable} colorsTable
   * @param {TypesTable} typesTable
   */
  constructor(knex, colorsTable, typesTable) {
    this.knex = knex;
    this.colorsTable = colorsTable;
    this.typesTable = typesTable;

    this.TABLE_NAME = 'products';

    this.DEFAULT_PRODUCT = {
      price: 0,
      quantity: 1,
    };
  }

  async createTable() {
    const isTableExists = await this.knex.schema.hasTable(this.TABLE_NAME);
    if (isTableExists) {
      console.log(`Table ${this.TABLE_NAME} is already created`);
    } else {
      await this.knex.schema.createTable(this.TABLE_NAME, (table) => {
        table.increments();
        table.integer('type_id').references('id').inTable(this.typesTable.TABLE_NAME).notNullable();
        table
          .integer('color_id')
          .references('id')
          .inTable(this.colorsTable.TABLE_NAME)
          .notNullable();
        table.unique(['color_id', 'type_id']);
        table.decimal('price').notNullable().defaultTo(this.DEFAULT_PRODUCT.price);
        table.integer('quantity').notNullable().defaultTo(this.DEFAULT_PRODUCT.quantity);
        table.timestamps(false, true);
        table.timestamp('deleted_at');
      });
      console.log(`Table ${this.TABLE_NAME} has been created`);
    }
  }

  // Requests

  async createProduct(requestProduct) {
    const colorId = await this.colorsTable.getColorIdByColor(requestProduct.color);

    const typeId = await this.typesTable.getTypeIdByType(requestProduct.type);

    if (!colorId) {
      throw new Error('No such color_id in the colors table. Please, create the color first');
    }
    if (!typeId) {
      throw new Error('No such type_id in the types table. Please, create the type first');
    }

    const productCopy = JSON.parse(
      JSON.stringify({
        quantity: requestProduct.quantity || 1,
        color_id: colorId,
        type_id: typeId,
        price: requestProduct.price,
      }),
    );

    const [createdProduct] = await this.knex(this.TABLE_NAME)
      .insert(productCopy)
      .returning('*')
      .onConflict(['color_id', 'type_id'])
      .merge({ quantity: this.knex.raw(`products.quantity + ${productCopy.quantity}`) })
      .returning('*');

    return createdProduct;
  }

  async updateProduct({ id, ...product }) {
    if (!id) {
      throw new Error('ERROR: No product id defined');
    }

    if (!Object.keys(product).length) {
      throw new Error('ERROR: Nothing to update');
    }

    const updateProduct = {};
    const updateRequests = Object.keys(product).map(async (key) => {
      switch (key) {
        case 'color':
          updateProduct.color_id = (await this.colorsTable.createColor(product.color)).id;
          break;
        case 'type':
          updateProduct.type_id = (await this.typesTable.createType(product.type)).id;
          break;

        default:
          updateProduct[key] = product[key];
          break;
      }

      return 0;
    });

    await Promise.all(updateRequests);
    updateProduct.updated_at = new Date();

    console.log({ id, updateProduct });

    const [updatedProduct] = await this.knex(this.TABLE_NAME)
      .update(updateProduct)
      .where({ id })
      .returning('*');

    console.log(`DEBUG: Product updated: ${JSON.stringify(updatedProduct)}`);
    return updatedProduct;
  }

  async getProduct(id) {
    try {
      if (!id) {
        throw new Error('ERROR: No product id defined');
      }

      const [foundProduct] = await this.knex(this.TABLE_NAME)
        .where(`${this.TABLE_NAME}.id`, id)
        .whereNull('deleted_at')
        .join(
          this.colorsTable.TABLE_NAME,
          `${this.TABLE_NAME}.color_id`,
          `${this.colorsTable.TABLE_NAME}.id`,
        )
        .join(
          this.typesTable.TABLE_NAME,
          `${this.TABLE_NAME}.type_id`,
          `${this.typesTable.TABLE_NAME}.id`,
        );
      // .select(`${this.colorsTable.TABLE_NAME}.value`);
      // .select(`${this.typesTable.TABLE_NAME}.value`);

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

      await this.knex(this.TABLE_NAME).where({ id }).update('deleted_at', new Date());

      return { status: true };
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  async getAllProducts() {
    try {
      const foundProducts = await this.knex(this.TABLE_NAME)
        .whereNull('deleted_at')
        .join(
          this.colorsTable.TABLE_NAME,
          `${this.TABLE_NAME}.color_id`,
          `${this.colorsTable.TABLE_NAME}.id`,
        )
        .join(
          this.typesTable.TABLE_NAME,
          `${this.TABLE_NAME}.type_id`,
          `${this.typesTable.TABLE_NAME}.id`,
        )
        .select(`${this.colorsTable.TABLE_NAME}.value`)
        .select(`${this.typesTable.TABLE_NAME}.value`);
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
