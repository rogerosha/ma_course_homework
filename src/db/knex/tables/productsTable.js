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
        price: requestProduct.price || this.DEFAULT_PRODUCT.price,
      }),
    );

    const [createdProductId] = await this.knex(this.TABLE_NAME)
      .insert(productCopy)
      .returning('*')
      .onConflict(['color_id', 'type_id', 'price'])
      .merge({ quantity: this.knex.raw(`products.quantity + ${productCopy.quantity}`) })
      .returning('id');

    return this.getProduct(createdProductId);
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

    await this.knex(this.TABLE_NAME).update(updateProduct).where({ id });
    return this.getProduct(id);
  }

  async getProduct(id) {
    try {
      if (!id) {
        throw new Error('ERROR: No product id defined');
      }

      const [foundProduct] = await this.buildJoin(
        this.knex(this.TABLE_NAME).where(`${this.TABLE_NAME}.id`, id),
      );

      return foundProduct;
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  /**
   * @param {number} id
   * @returns {number}
   */
  getProductQuantity(id) {
    return +this.knex(this.TABLE_NAME).where({ id }).select('quantity').first();
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
      return await this.buildJoin(this.knex(this.TABLE_NAME));
    } catch (err) {
      console.error(err.message || err);
      throw err;
    }
  }

  /**
   * @private
   * @param {Knex.QueryBuilder} knexRequest - initial request
   *
   * @returns {Knex.QueryBuilder}
   */
  buildJoin(knexRequest) {
    return knexRequest
      .where(`${this.TABLE_NAME}.deleted_at`, null)
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
      .select(
        `${this.TABLE_NAME}.id`,
        `${this.typesTable.TABLE_NAME}.type`,
        `${this.colorsTable.TABLE_NAME}.color`,
        `${this.TABLE_NAME}.price`,
        `${this.TABLE_NAME}.quantity`,
        `${this.TABLE_NAME}.weight`,
        `${this.TABLE_NAME}.created_at`,
        `${this.TABLE_NAME}.updated_at`,
      );
  }
}

module.exports = {
  ProductsTable,
};
