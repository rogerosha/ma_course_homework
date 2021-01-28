const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const { nanoid } = require('nanoid');
const es = require('event-stream');

const { config } = require('../config');
const { createCsvToJson } = require('../utils/csv-to-json');

const promisifiedPipeline = promisify(pipeline);

async function csvUploadFile(inputStream) {
  const { uploadDir } = config;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}-${nanoid()}.json`;
  const filePath = `${uploadDir}/${fileName}`;

  const gunzip = createGunzip();
  const csvToJson = createCsvToJson();
  const outputStream = fs.createWriteStream(filePath);

  try {
    await promisifiedPipeline(inputStream, gunzip, es.split(), csvToJson, outputStream);
  } catch (err) {
    console.error('CSV pipeline failed', err);

    try {
      await fs.unlinkSync(filePath);
    } catch (rmErr) {
      console.error(`Unable to remove JSON ${filePath}`, rmErr);
      throw new Error('Unable to remove JSON');
    }
  }

  return fileName;
}

module.exports = {
  csvUploadFile,
};
