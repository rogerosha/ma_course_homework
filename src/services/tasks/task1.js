function task1(inputGoods, property, value) {
  return inputGoods.filter((good) => good[property] === value);
}

module.exports = {
  task1,
};
