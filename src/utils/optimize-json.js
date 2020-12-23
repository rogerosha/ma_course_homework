const { Writable } = require('stream');

function applyToOptimized(optimizedGoods, stringifiedGoods) {
  const unoptimizedGoods = stringifiedGoods.map((good) => {
    try {
      return JSON.parse(good);
    } catch (err) {
      console.error('Failed to parse JSON good', err);
      return {};
    }
  });

  unoptimizedGoods.forEach((good) => {
    const optimizedGood = optimizedGoods.find((op) => {
      return op.type === good.type && op.color === good.color && op.price === good.price;
    });

    if (optimizedGood) {
      optimizedGood.quantity += good.quantity;
      return;
    }

    optimizedGoods.push(good);
  });
}

function createJsonOptimizer(optimizedGood) {
  let isFirstChunk = true;
  let productFragment = '';

  const write = (chunk, encoding, callback) => {
    let stringifiedChunk = chunk.toString();

    if (isFirstChunk) {
      stringifiedChunk = stringifiedChunk.slice(1);
      isFirstChunk = false;
    } else {
      stringifiedChunk = productFragment + stringifiedChunk;
    }

    const stringifiedGoods = stringifiedChunk.split(',\n');

    productFragment = stringifiedGoods.pop();
    if (stringifiedGoods.length === 0) {
      callback();
      return;
    }

    applyToOptimized(optimizedGood, stringifiedGoods);
    callback();
  };

  return new Writable({ write });
}

module.exports = {
  createJsonOptimizer,
};
