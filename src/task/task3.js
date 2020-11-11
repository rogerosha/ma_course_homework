function task3(inputGoods) {
  return inputGoods.map((good) => {
    return {
      type: good.type || '',
      color: good.color || '',
      quantity: good.quantity || 0,
      price: good.price || good.priceForPair || '',
    };
  });
}

module.exports = {
  task3,
};
