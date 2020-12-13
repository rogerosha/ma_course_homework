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

function makeEndResponse(response) {
  return (message, statusCode = 200) => {
    response.statusCode = statusCode;
    response.end(JSON.stringify(message));
  };
}

async function handleStreamRoutes(request, response) {
  const endResponse = makeEndResponse(response);
  const { url, method } = request;
  response.setHeader('Content-Type', 'application/json');

  if (method === 'POST' && url === '/upload/csv') {
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error('Failed to upload CSV', err);
      endResponse({ status: err.message }, 500);
      return;
    }
    endResponse({ status: 'everything is okay' });
    return;
  }
  notFound(response);
}

async function handleRoutes(request, response) {
  const { body, url, method, queryParams } = request;
  const urlPath = path.parse(url);
  const endResponse = makeEndResponse(response);
  response.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url.split('?')[0] === '/task1') {
    const { property, value } = queryParams;
    const result = task1(property, +value);

    endResponse(result);
    return;
  }

  if (method === 'GET' && url === '/task2') {
    const result = task2();
    endResponse(result);
    return;
  }

  if (method === 'GET' && url === '/task3') {
    const result = task3();
    endResponse(result);
    return;
  }

  if (method === 'POST' && url === '/store') {
    setStore(body);
    endResponse({ status: 'ok' });
    return;
  }

  if (method === 'GET' && url === '/store/switch') {
    switchStore();
    endResponse({ status: 'ok' });
    return;
  }

  if (method === 'GET' && url === '/upload') {
    try {
      const fileList = await getUploadFileList();
      endResponse(fileList);
    } catch (err) {
      console.error('Failed to get file list', err);
      endResponse({ status: err.message }, 500);
    }
    return;
  }

  if (method === 'PUT' && urlPath.dir === '/upload/optimize') {
    const fileName = urlPath.base;
    try {
      await getUploadFileList(request);
    } catch (err) {
      endResponse({ status: err.message }, 500);
      return;
    }
    optimizeJson(fileName).catch((err) => {
      console.error('Something goes wrong', err);
      endResponse({ status: err.message }, 500);
    });
    endResponse({ status: 'okay' }, 202);
    return;
  }

  notFound(response);
}

module.exports = {
  handleRoutes,
  handleStreamRoutes,
};
