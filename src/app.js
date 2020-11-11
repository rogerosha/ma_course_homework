const { task1: filterGoods, task2: findMostExpensiveGood, task3 } = require('./task');
const goods = require('../goods.json');

function boot(inputGoods, property, value) {
  const task1result = filterGoods(inputGoods, property, value);
  console.log(task1result);

  const task3result = task3(task1result);
  console.log(task3result);

  const task2result = findMostExpensiveGood;
  console.log(task2result);
}
boot(goods, 'type', 'socks');
