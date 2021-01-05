const express = require('express');
const bodyParser = require('body-parser');
const { addAsync } = require('@awaitjs/express');
const { config } = require('../config');
const { router } = require('./router.js');
const authorizeCheck = require('./middlewares/authorizeCheck');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const db = require('../db/pg');
const { productRouter } = require('./productRouter.js');

const app = addAsync(express());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/', authorizeCheck, router);
app.use('/products/', authorizeCheck, productRouter);
app.use(notFound);
app.use(errorHandler);

let server;

async function start() {
  try {
    await db.init();

    console.log(`Now DB type is ${db.getType()}`);

    db.setType('knex');

    console.log(`Now DB type is ${db.getType()}`);

    await db.createTable();
  } catch (err) {
    console.error(err.message || err);
  }

  server = app.listen(config.port, () => console.log(`server is listening on ${config.port}`));
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
