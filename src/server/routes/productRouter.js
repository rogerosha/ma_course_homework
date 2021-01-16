const { Router } = require('@awaitjs/express');
const db = require('../../db');

const productRouter = Router();

productRouter.postAsync('/', async (req, res) => {
  const result = await db.productsTable.createProduct(req.body);
  res.status(200).json(result || {});
});

productRouter.getAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.productsTable.getProduct(id);
  res.status(200).json(result || {});
});

productRouter.putAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  const result = await db.productsTable.updateProduct({ id, ...product });
  res.status(200).json(result);
});

productRouter.deleteAsync('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.productsTable.deleteProduct(id);
  res.status(200).json(result);
});

productRouter.getAsync('/', async (req, res) => {
  const result = await db.productsTable.getAllProducts();
  res.status(200).json(result);
});

module.exports = {
  productRouter,
};
