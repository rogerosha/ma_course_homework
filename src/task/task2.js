const goodsList = require('../../goods.json');

function findMostExpensiveGood(goods) {
  let maxPrice = 0;
  let resultGood = null;

  goods.forEach((good) => {
    const currentMaxPrice = (good.quantity || 0) * +(good.priceForPair || good.price).split('$')[1];

    if (currentMaxPrice > maxPrice) {
      maxPrice = currentMaxPrice;
      resultGood = good;
    }
  });

  return resultGood;
}

module.exports = {
  task2: findMostExpensiveGood(goodsList),
};
