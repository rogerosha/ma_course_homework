require('dotenv').config();

const http = require('http');
const requestHandler = require('./requestHandler');

const server = http.createServer(requestHandler);

function start() {
  server.listen(Number(process.env.PORT), () =>
    console.log(`server is listening on ${process.env.PORT}`),
  );
}

module.exports = {
  start,
};
