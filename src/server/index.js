const express = require('express');
const bodyParser = require('body-parser');
const { addAsync } = require('@awaitjs/express');
// const { db: dbConfig } = require('../config');
const { router } = require('./router.js');
const authorizeCheck = require('./middlewares/authorizeCheck');
const { errorHandler } = require('./middlewares/errorHandler');
const db = require('../db');
// const client = new Pool(dbConfig);

// const app = express();
const app = addAsync(express());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/', authorizeCheck, router);
app.use(errorHandler);

let server;

async function start() {
  try {
    await db.testConnection();

    const product = await db.createProduct({ type: 'socks', color: 'red', price: 3.3 });
    console.log(`product: ${JSON.stringify(product)}`);
  } catch (err) {
    console.error(err.message || err);
  }
  await db.testConnection();

  const product = await db.createProduct({ type: 'socks', color: 'red', price: 3.3 });
  console.log(`product: ${JSON.stringify(product)}`);
  // server = app.listen(config.port, () => console.log(`server is listening on ${config.port}`));
}

function stop(callback) {
  if (!server) return console.error('Server is not running');

  server.close((err) => {
    if (err) {
      console.error(err, 'Failed to close server');
      callback();
      return;
    }

    console.log('\n\nServer is stopped!\n');
    callback();
  });
  return 0;
}

module.exports = {
  start,
  stop,
  app,
};
