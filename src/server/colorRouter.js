const { Router } = require('@awaitjs/express');
const db = require('../db');

const colorRouter = Router();

colorRouter.postAsync('/', async (req, res) => {
  const result = await db.colorsTable.createColor(req.body.color);
  res.status(200).json(result || {});
});

colorRouter.getAsync('/:id', async (req, res) => {
  const result = await db.colorsTable.getColorById(+req.params.id);
  res.status(200).json(result);
});

colorRouter.getAsync('/', async (req, res) => {
  const result = await db.colorsTable.getAllColors();
  res.status(200).json(result);
});

colorRouter.putAsync('/:id', async (req, res) => {
  const result = await db.colorsTable.updateColor(+req.params.id, req.body);
  res.status(200).json(result);
});

colorRouter.deleteAsync('/:id', async (req, res) => {
  const result = await db.colorsTable.deleteColor(+req.params.id);
  res.status(200).json(result);
});

module.exports = {
  colorRouter,
};
