const DISCOUNT_MAX = 99;
const DISCOUNT_MIN = 1;

const VALID_DISCOUNT_MAX = 20;

function generateDiscount(callback) {
  setTimeout(() => {
    const discount = Math.floor(Math.random() * DISCOUNT_MAX) + DISCOUNT_MIN;
    callback(discount);
  }, 50);
}

function getValidDiscount(callback) {
  const validDiscountCallback = (discount) => {
    if (discount >= VALID_DISCOUNT_MAX) {
      console.log(`Discount "${discount}" is too big. Trying again...`);
      return generateDiscount(validDiscountCallback);
    }

    return callback(discount);
  };

  generateDiscount(validDiscountCallback);
}

function main() {
  const logValidDiscount = (validDiscount) => {
    console.log(validDiscount);
  };

  getValidDiscount(logValidDiscount); // can be replaced by getValidDiscount(console.log);
}

main();

module.exports = {
  generateDiscount,
  getValidDiscount,
  main,
};
