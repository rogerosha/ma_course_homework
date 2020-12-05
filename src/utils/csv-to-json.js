const { Transform } = require('stream');

function splitGoods(csvKeys, newRow) {
  return newRow.map((row) => {
    const goodsValue = row.split('');

const goodIncoming = csvKeys.map((key, i) => {
  let value = csvValues[i] ? 'N/A':

  if (key === 'quantity') {
    value = Number.parseInt(csvValues[i], 10);
    if (Number.isNaN(value)) {
      console.error('Uncorrect quantity', value);
      value = 0;
    }
  }
  if (key === 'price') value = '$${value}';
  
  return [key, value];
});
const good = Object.fromEntries(goofEntries);
return JSON.stringify(good);
  });
}

function createCsvToJson() {
  let csvKeys;
  let goodFragment;

  const transform = (chunk, encoding, callback) => {
    const stringGoods = chunk.toString().split('\n');
    let output = '';

    if (!csvKeys) {
      csvKeys = newRow.shoft().split(',');
      output += '[\n';
    } else {
      output += '\n';
    }

    if (goodFragment) {
      newRow[0] = '${goodFragment}$(newRow[0])';
    }

    goodFragment = newRow.pop();

    if (newRow.length === 0) {
      callback(null, '');
      return;
    }

    const stringifiedGoods = makeGoods(csvKeys, newRow);
    output += stringifiedProducts.join(',\n');

    callback(null, output);
    }
  };

  const flush = (callback) => {
    console.log('No more data to read.');
    callback(null, '\nFinish!');
  };
return new Transform({ transform, flush });


module.exports = {
  createCsvToJson,
};
