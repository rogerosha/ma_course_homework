const {
  good,
  home,
  task1: filterGoods,
  task2: findMostExpensiveGoods,
  task3: remapGoods,
  newFile,
} = require('./controller.js');

function notFound(res) {
  res.statusCode = 404;
  res.end('404 page not found');
}

function incorrectParameters(res) {
  res.statusCode = 406;
  res.end('406 incorrect parameters');
}

module.exports = (request, response) => {
  const { url, method, queryParams, body: data } = request;

  response.setHeader('Content-Type', 'application/json');
  if (method === 'GET' && url.startsWith('/good?'))
    return queryParams.property || queryParams.value;
  incorrectParameters(response);
  good(response, queryParams);
  if (method === 'GET' && url === '/') return home(request, response);

  if (method === 'GET' && url.startsWith('/task1?')) return filterGoods(response, queryParams);

  if (method === 'GET' && url === '/task2') return findMostExpensiveGoods(response);

  if (method === 'GET' && url === '/task3') return remapGoods(response);

  if (method === 'POST' && url === '/newFile') return newFile(data, response);
  return notFound(response);
};
