const {filterGoods: task1, findMostExpensiveGood: task2, remapGoods} = require('./task');
const goods = require('./goods.json');

function boot(goods, property, value) {
const task1result = task1(goods, property, value);
console.log(task1result);
const task3result = remapGoods(task1result);
console.log(task3result);
const task2result = task2(task3result);
console.log(task2result);
}
boot(goods, "type", "socks")