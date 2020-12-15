const { myMap } = require('../discount/myMap');

function task3(inputGoods) {
  return myMap(inputGoods, (good) => {
    return {
      type: good.type || '',
      color: good.color || '',
      quantity: good.quantity || 0,
      price: good.price || good.priceForPair || '',
      discount: 0,
    };
  });
}

module.exports = {
  task3,
};
