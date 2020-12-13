const path = require('path');

const {
  task1,
  task2,
  task3,
  setStore,
  switchStore,
  uploadCsv,
  getUploadFileList,
  optimizeJson,
} = require('./controller.js');

function notFound(res) {
  res.statusCode = 404;
  res.end('404 page not found');
}

function makeEndResponse(response, message, statusCode = 200) {
  response.statusCode = statusCode;
  response.end(JSON.stringify(message));
}

async function handleStreamRoutes(request, response) {
  const { url, method } = request;
  response.setHeader('Content-Type', 'application/json');

  if (method === 'POST' && url === '/upload/csv') {
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error('Failed to upload CSV', err);
      makeEndResponse(response, { status: err.message }, 500);
      return;
    }
    makeEndResponse(response, { status: 'everything is okay' });
    return;
  }
  notFound(response);
}

async function handleRoutes(request, response) {
  const { body, url, method, queryParams } = request;
  const urlPath = path.parse(url);
  response.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url.split('?')[0] === '/task1') {
    const { property, value } = queryParams;
    const result = task1(property, +value);

    makeEndResponse(response, result);
    return;
  }

  if (method === 'GET' && url === '/task2') {
    const result = task2();
    makeEndResponse(response, result);
    return;
  }

  if (method === 'GET' && url === '/task3') {
    const result = task3();
    makeEndResponse(response, result);
    return;
  }

  if (method === 'POST' && url === '/store') {
    setStore(body);
    makeEndResponse(response, { status: 'ok' });
    return;
  }

  if (method === 'GET' && url === '/store/switch') {
    switchStore();
    makeEndResponse(response, { status: 'ok' });
    return;
  }

  if (method === 'GET' && url === '/upload') {
    try {
      const fileList = await getUploadFileList();
      makeEndResponse(response, fileList);
    } catch (err) {
      console.error('Failed to get file list', err);
      makeEndResponse(response, { status: err.message }, 500);
    }
    return;
  }

  if (method === 'PUT' && urlPath.dir === '/upload/optimize') {
    const fileName = urlPath.base;
    try {
      await getUploadFileList(request);
    } catch (err) {
      makeEndResponse(response, { status: err.message }, 500);
      return;
    }
    optimizeJson(fileName).catch((err) => {
      console.error('Something goes wrong', err);
      makeEndResponse(response, { status: err.message }, 500);
    });
    makeEndResponse(response, { status: 'okay' }, 202);
    return;
  }

  notFound(response);
}

module.exports = {
  handleRoutes,
  handleStreamRoutes,
};
