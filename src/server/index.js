const express = require('express');
const bodyParser = require('body-parser');
const { addAsync } = require('@awaitjs/express');
const { config } = require('../config');
const {
  router,
  loginRouter,
  productRouter,
  colorRouter,
  typeRouter,
  orderRouter,
} = require('./routes');
const authorizeCheck = require('./middlewares/authorizeCheck');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const db = require('../db');

const app = addAsync(express());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/', loginRouter);

app.use('/', authorizeCheck, router);
app.use('/products/', authorizeCheck, productRouter);
app.use('/colors/', authorizeCheck, colorRouter);
app.use('/types/', authorizeCheck, typeRouter);
app.use('/orders/', authorizeCheck, orderRouter);
app.use(notFound);
app.use(errorHandler);

let server;

async function start() {
  try {
    await db.init();
  } catch (err) {
    console.error(err);
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
