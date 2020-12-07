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

const pathToFile = path.resolve(__dirname, '../../', 'goods.json');

const store = {
  local: goodsList,
  uploaded: {},
  current: goodsList,
};

function filterGoods(property, value) {
  return tasks.filterGoods(store.current, property, value);
}

function findMostExpensiveGoods() {
  return tasks.FindMostExpensiveGoods;
}

function remapGoods() {
  return tasks.remapGoods(store.current);
}

function setStore(newProducts) {
  store.uploaded = newProducts;
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

const goods = require('../../goods.json');
const { task1: firstTask, task2: secondTask, task3: thirdTask } = require('../task');
const { notFound } = require('./router.js');
const { generateValidDiscountPromise } = require('../discount/discount.js');

let goodsArr = [];

function task1(response, queryParams) {
  if (queryParams.field === 'quantity') {
    goodsArr = firstTask(goods, queryParams.field, +queryParams.value);
  } else {
    goodsArr = firstTask(goods, queryParams.field, queryParams.value);
  }
  response.end(JSON.stringify(goodsArr));
}

function task2(response) {
  response.end(JSON.stringify(secondTask));
}

function task3(response) {
  response.end(JSON.stringify(thirdTask(goods)));
}

function newFile(data, response) {
  if (
    Array.isArray(data) ||
    data.some((param) => param.type || param.color || param.price || param.priceForPair)
  )
    return notFound(response);
  fs.writeFileSync(pathToFile, JSON.stringify(data, null, 1));
  response.end(JSON.stringify(data));
  return response.end();
}

async function addDiscount(response) {
  const productsWithDiscount = await Promise.all(
    goods.map(async (valueIs) => {
      let discount = await generateValidDiscountPromise();

      if (valueIs.type === 'hat') {
        discount += await generateValidDiscountPromise();
      }

      if (valueIs.type === 'hat' && valueIs.color === 'red') {
        discount += await generateValidDiscountPromise();
      }

      valueIs.discount = discount;

      return valueIs;
    }),
  );
  response.end(JSON.stringify(productsWithDiscount));
}

module.exports = {
  filterGoods,
  findMostExpensiveGoods,
  remapGoods,
  task1,
  task2,
  task3,
  newFile,
  addDiscount,
  setStore,
  switchStore,
  uploadCsv,
  getUploadFileList,
  optimizeJson,
};
