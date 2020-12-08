const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { config } = require('../config');

const { createJsonOptimizer } = require('../utils/optimize-json');
const { tasks } = require('../services');

const localProducts = require('../../goods.json');

const promisifiedPipeline = promisify(pipeline);

const store = {
  local: localProducts,
  uploaded: {},
  current: localProducts,
};

function task1(req, res) {
  const { field, value } = req.query;
  const result = tasks.task1(store.current, field, value);
  res.json(result);
}

function task2(req, res) {
  const result = tasks.task2;
  res.json(result);
}

function task3(req, res) {
  const result = tasks.task3(store.current);
  res.json(result);
}

function setStore(req, res) {
  const newProducts = req.body;
  store.uploaded = newProducts;
  res.json(newProducts);
}

function switchStore(req, res) {
  store.current = store.current === localProducts ? store.uploaded : localProducts;
  res.json(store.current);
}

async function getUploadFileList() {
  const { uploadDir } = config;

  try {
    const files = await fs.promises.readdir(uploadDir);
    const jsonFiles = files.filter((filename) => filename.toLowerCase().endsWith('.json'));
    return { files: jsonFiles };
  } catch (err) {
    console.error(`Unable to scan directory ${uploadDir}`, err);
    throw new Error('Unable to scan directory');
  }
}

async function optimizeJson(filename) {
  const { uploadDir, optimizedDir } = config;
  const filePath = path.join(uploadDir, filename);

  const optimizedFilePath = path.join(optimizedDir, filename);

  const fileReader = fs.createReadStream(filePath);

  const optimizedProducts = [];
  const optimizer = createJsonOptimizer(optimizedProducts);

  try {
    await promisifiedPipeline(fileReader, optimizer);
  } catch (err) {
    console.error('Optimization pipeline failed', err);
  }

  try {
    const optimizedJson = JSON.stringify(optimizedProducts);
    await fs.promises.writeFile(optimizedFilePath, optimizedJson);
  } catch (err) {
    console.error(`Unable to write optimized JSON to ${optimizedDir}`, err);
    throw new Error('Unable to write optimized JSON');
  }

  try {
    await fs.promises.rm(filePath);
  } catch (err) {
    console.error(`Unable to remove JSON ${filePath}`, err);
    throw new Error('Unable to remove JSON');
  }

  const totalQuantity = optimizedProducts.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  console.log(`Optimization process finished. Total product quantity: ${totalQuantity}`);
}

module.exports = {
  task1,
  task2,
  task3,
  setStore,
  switchStore,
  getUploadFileList,
  optimizeJson,
};
