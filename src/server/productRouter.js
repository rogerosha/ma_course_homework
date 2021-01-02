const { Router } = require('@awaitjs/express');
const db = require('../db');

const productRouter = Router();

productRouter.postAsync('/', async (req, res) => {
  const { type, color, price, quantity } = req.body;
  const result = await db.createProduct({ type, color, price, quantity });
  res.status(200).json(result || {});
});

productRouter.getAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.getProduct(id);
  res.status(200).json(result || {});
});

productRouter.putAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  const result = await db.updateProduct({ id, ...product });
  res.status(200).json(result);
});

productRouter.deleteAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.deleteProduct(id);
  res.status(200).json(result);
});

module.exports = {
  productRouter,
};
