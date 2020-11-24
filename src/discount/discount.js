const maxDisc = 99;
const minDisc = 1;

const maxValidDisc = 20;

function generateDiscount(callback) {
  setTimeout(() => {
    const discount = Math.floor(Math.random() * maxDisc) + minDisc;
    if (discount >= maxValidDisc) {
      callback(new Error('Failed to get a discount'));
      return;
    }
    callback(null, discount);
  }, 50);
}

function generateValidDiscount(callback) {
  generateDiscount((err, discount) => {
    if (err) {
      generateValidDiscount(callback);
      return;
    }
    callback(null, discount);
  });
}

function generateValidDiscountPromise() {
  return new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };
    generateValidDiscount(callback);
  });
}

function main() {
  const logValidDiscount = (validDiscount) => {
    console.log(validDiscount);
  };

  generateValidDiscount(logValidDiscount);
}

main();

module.exports = {
  generateDiscount,
  generateValidDiscountPromise,
  main,
};
