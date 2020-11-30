const { Transform } = require('stream');

function createCsvToJson() {
  const transform = (chunk, encoding, callback) => {
    console.log(chunk.toString());
    callback(null, 'JSON string\n');
  };

  const flush = (callback) => {
    console.log('No more data to read.');
    callback(null, '\nFinish!');
  };

  return new Transform({ transform, flush });
}

module.exports = {
  createCsvToJson,
};
