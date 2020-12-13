const { Transform } = require('stream');

function makeGoods(csvKeys, csvValues) {
  const goodEntries = {};

  csvKeys.forEach((key, i) => {
    let value = csvValues[i] || 'N/A';

    if (key === 'quantity') {
      value = Number.parseInt(csvValues[i], 10);
      if (Number.isNaN(value)) {
        console.error('Uncorrect quantity', value);
        value = 0;
      }
    }
    if (key === 'price') value = `$${value}`;

    goodEntries[key] = value;
  });

  return goodEntries;
}
function createCsvToJson() {
  let firstLine;
  let needComma = false;

  const transform = (chunk, encoding, callback) => {
    const newRow = chunk.toString().split(',');

    if (!firstLine) {
      firstLine = newRow;
      return callback(null, '[');
    }
    if (newRow[0] === '') return callback(null, '');
    let output = '';
    if (needComma) output += ',\n';
    else needComma = true;

    const good = makeGoods(firstLine, newRow);
    output += JSON.stringify(good);

    return callback(null, output);
  };

  const flush = (callback) => {
    console.log('No more data to read.');
    callback(null, ']');
  };
  return new Transform({ transform, flush });
}

module.exports = {
  makeGoods,
  createCsvToJson,
};
