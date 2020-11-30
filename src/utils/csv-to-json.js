const { Writable } = require('stream');

function createCsvToJson() {
  const writable = (chunk, encoding, callback) => {
    console.log(chunk.toString());
    callback.write(null, 'JSON string\n');
  };

  const flush = (callback) => {
    console.log('No more data to read.');
    callback(null, '\nFinish!');
  };

  return new Writable({ writable, flush });
}

module.exports = {
  createCsvToJson,
};
