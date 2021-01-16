const { Router } = require('@awaitjs/express');
const db = require('../../db');

const typeRouter = Router();

typeRouter.postAsync('/', async (req, res) => {
  const result = await db.typesTable.createType(req.body.type);
  res.status(200).json(result || {});
});

typeRouter.getAsync('/:id', async (req, res) => {
  const result = await db.typesTable.getTypeById(+req.params.id);
  res.status(200).json(result);
});

typeRouter.getAsync('/', async (req, res) => {
  const result = await db.typesTable.getAllTypes();
  res.status(200).json(result);
});

typeRouter.putAsync('/:id', async (req, res) => {
  const result = await db.typesTable.updateType(+req.params.id, req.body);
  res.status(200).json(result);
});

typeRouter.deleteAsync('/:id', async (req, res) => {
  const result = await db.typesTable.deleteType(+req.params.id);
  res.status(200).json(result);
});

module.exports = {
  typeRouter,
};
