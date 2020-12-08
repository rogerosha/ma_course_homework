const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { createGunzip } = require('zlib');
const { promisify } = require('util');

const { nanoid } = require('nanoid');
const es = require('event-stream');

const { createCsvToJson } = require('../utils/csv-to-json');
const { createJsonOptimizer } = require('../utils/optimize-json');
const tasks = require('../task');

const goodsList = require('../../goods.json');

const promisifiedPipeline = promisify(pipeline);

const store = {
  local: goodsList,
  uploaded: {},
  current: goodsList,
};

function task1(property, value) {
  return tasks.task1(store.current, property, value);
}

function task2() {
  return tasks.task2;
}

function task3() {
  return tasks.task3(store.current);
}

function setStore(newGoods) {
  store.uploaded = newGoods;
}

function switchStore() {
  store.current = store.current === goodsList ? store.uploaded : goodsList;
}

async function uploadCsv(inputStream) {
  const uploadDir = `${process.env.UPLOAD_DIR}`;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const gunzip = createGunzip();

  const timestamp = Date.now();
  const filePath = `${uploadDir}/${timestamp}-${nanoid()}.json`;
  const outputStream = fs.createWriteStream(filePath);
  const csvToJson = createCsvToJson();

  try {
    await promisifiedPipeline(inputStream, gunzip, es.split(), csvToJson, outputStream);
  } catch (err) {
    console.error('CSV pipeline failed', err);

    try {
      await fs.unlinkSync(filePath);
    } catch (rmErr) {
      console.error(`Unable to remove JSON ${filePath}`, rmErr);
      throw new Error('Unable to remove JSON');
    }
  }
}

async function getUploadFileList() {
  const uploadDir = process.env.UPLOAD_DIR;

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
  const uploadDir = process.env.UPLOAD_DIR;
  const filePath = path.join(uploadDir, filename);

  const optimizedDir = process.env.OPTIMIZED_DIR;
  const optimizedFilePath = path.join(optimizedDir, filename);

  const fileReader = fs.createReadStream(filePath);

  const optimizedGoods = [];
  const optimizer = createJsonOptimizer(optimizedGoods);

  try {
    await promisifiedPipeline(fileReader, optimizer);
  } catch (err) {
    console.error('Optimization pipeline failed', err);
  }

  try {
    const optimizedJson = JSON.stringify(optimizedGoods);
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

  const totalQuantity = optimizedGoods.reduce((total, good) => {
    return total + good.quantity;
  }, 0);

  console.log(`Optimization process finished. Total good quantity: ${totalQuantity}`);
}

module.exports = {
  task1,
  task2,
  task3,
  setStore,
  switchStore,
  uploadCsv,
  getUploadFileList,
  optimizeJson,
};
