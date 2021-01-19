/* eslint-disable no-unused-vars */
const Knex = require('knex');
const { ProductsTable } = require('./productsTable');
const { NovaPoshtaService } = require('../../../services/novaPoshtaService');

class OrdersTable {
  /**
   * @param {Knex} knex
   * @param {ProductsTable} productsTable
   * @param {NovaPoshtaService} novaPoshtaService
   */
  constructor(knex, productsTable, novaPoshtaService) {
    this.knex = knex;
    this.productsTable = productsTable;
    this.novaPoshtaService = novaPoshtaService;
    this.TABLE_NAME = 'orders';
    this.knexRequest = this.knex(this.TABLE_NAME);
  }

  /**
   * @param {number} productId
   * @param {string} orderDestination - City where to create a shipment
   * @param {number} orderQuantity - Shipment quantity
   * @param {number} status
   */
  async createOrder(productId, orderDestination, orderQuantity, status) {
    if (orderQuantity < 1) {
      throw new Error('Min order quantity is 1');
    }

    const product = await this.productsTable.getProduct(productId);
    const productQuantityLeft = product.quantity - orderQuantity;

    if (productQuantityLeft < 0) {
      throw new Error(
        `There are no such amount of the product in the warehouse. Available product quantity is: ${product.quantity}`,
      );
    }

    await this.productsTable.updateProduct({
      id: productId,
      quantity: productQuantityLeft,
    });

    const newOrder = {
      product_id: productId,
      status,
      quantity: orderQuantity,
      destination: await this.novaPoshtaService.getCityRefFromName(orderDestination),
      price: await this.novaPoshtaService.getShipmentPrice(product, orderDestination),
    };

    return this.knexRequest
      .insert(newOrder)
      .returning('*')
      .then(([response]) => response);
  }

  /**
   * @param {string} uuid - UUIDv4
   * @returns {Promise<any>} - Order
   */
  getOrder(uuid) {
    return this.knexRequest.where({ uuid }).then(([order]) => order);
  }

  /**
   * @param {string} uuid - UUIDv4
   * @param {0|1|2} status - Order status
   * @returns {Promise<boolean>} - is updated or not
   */
  async updateOrderStatus(uuid, status) {
    const order = await this.knexRequest.where({ uuid }).select('product_id').first();

    if (status === 2) {
      await this.productsTable.updateProduct({
        id: order.product_id,
        quantity: order.quantity + this.productsTable.getProductQuantity(order.product_id),
      });
    }

    return this.knexRequest.where({ uuid }).update({ status }).then(Boolean);
  }
}

module.exports = {
  OrdersTable,
};
