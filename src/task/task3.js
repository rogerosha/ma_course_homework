function task3(inputGoods) {
  return inputGoods.myMap((good) => {
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
