const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const { nanoid } = require('nanoid');

const { config } = require('../config');

const promisifiedPipeline = promisify(pipeline);

const { createCsvToJson } = require('../utils/csv-to-json');

async function csvUploadFile(inputStream) {
  const gunzip = createGunzip();
  const filePath = `${config.uploadDir}/${Date.now()}-${nanoid(8)}.json`;
  const outputStream = fs.createWriteStream(`${filePath}`);
  const csvToJson = createCsvToJson();
  console.log(csvToJson);
  promisifiedPipeline(inputStream, gunzip, csvToJson, outputStream);
}

module.exports = {
  csvUploadFile,
};
