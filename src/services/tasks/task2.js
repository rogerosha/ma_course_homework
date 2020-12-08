const goods = require('../../../goods.json');

function task2(inputGoods) {
  let maxPrice = 0;
  let resultGood = null;

  inputGoods.forEach((good) => {
    const currentMaxPrice = (good.quantity || 0) * +(good.priceForPair || good.price).split('$')[1];

    if (currentMaxPrice > maxPrice) {
      maxPrice = currentMaxPrice;
      resultGood = good;
    }
  });

  return resultGood;
}

module.exports = {
  task2: task2(goods),
};
