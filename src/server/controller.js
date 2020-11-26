const fs = require('fs');
const path = require('path');

const pathToFile = path.resolve(__dirname, '../../', 'goods.json');

const goods = require('../../goods.json');
const { task1: firstTask, task2: secondTask, task3: thirdTask } = require('../task');
const { notFound } = require('./routing.js');
const { generateValidDiscountPromise } = require('../discount/discount.js');

let goodsArr = [];

function home(request, response) {
  response.end();
}

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
  home,
  task1,
  task2,
  task3,
  newFile,
  addDiscount,
};
