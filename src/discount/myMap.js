function myMap(array, callback, thisArg) {
  const output = [];
  for (let i = 0; i < array.length; i += 1) {
    output.push(callback.call(thisArg, array[i], i, array));
  }
  return output;
}

module.exports = {
  myMap,
};
