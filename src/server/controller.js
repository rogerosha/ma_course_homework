const fs = require('fs');
const path = require('path');

const pathToFile = path.resolve(__dirname, '../../', 'goods.json');

const goods = require('../../goods.json');
const {
  task1: firstTask,
  task2: secondTask,
  task3: thirdTask,
  discount: outputDiscount,
} = require('../task');
const incorrectParameters = require('./routing.js');

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

function discount(response) {
  response.end(JSON.stringify(outputDiscount(response)));
}

function newFile(inf, response) {
  if (
    Array.isArray(inf) ||
    inf.length < 1 ||
    inf.some((param) => param.type || param.color || param.price || param.priceForPair)
  )
    return incorrectParameters(response);
  fs.writeFileSync(pathToFile, JSON.stringify(inf, null, 1));
  response.end(JSON.stringify(inf));
  return response.end();
}

module.exports = {
  home,
  task1,
  task2,
  task3,
  discount,
  newFile,
};
