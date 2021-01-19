const { Router } = require('@awaitjs/express');
const db = require('../../db');

const orderRouter = Router();

orderRouter.postAsync('/', async (req, res) => {
  const { productId, orderDestination, orderQuantity } = req.body;

  const result = await db.ordersTable.createOrder({ productId, orderDestination, orderQuantity });
  res.status(200).json(result || {});
});

orderRouter.getAsync('/:uuid', async (req, res) => {
  const result = await db.ordersTable.getOrder(req.params.uuid);
  res.status(200).json(result);
});

orderRouter.putAsync('/:uuid/status', async (req, res) => {
  const result = await db.ordersTable.updateOrderStatus(req.params.uuid, +req.body.status);
  res.status(200).json(result);
});

module.exports = {
  orderRouter,
};
