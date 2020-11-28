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
  response.statusCode = 200;
  console.warn('Cannot end response. Response is finished.');
}

async function handleStreamRoutes(request, response) {
  const endResponse = makeEndResponse(response);
  const { url, method } = request;

  response.setHeader('Content-Type', 'application/json');

  if (method === 'PUT' && url === '/upload/csv') {
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error('Failed to upload CSV', err);

      response.statusCode = 500;
      response.end('500 server error');
      return;
    }
    endResponse({ status: 'ok' });
    return;
  }
  notFound(response);
}

async function handleRoutes(request, response) {
  const endResponse = makeEndResponse(response);
  const { body, url, method } = request;
  const urlPath = path.parse(url.pathname);

  if (method === 'GET' && url.pathname === '/task1?') {
    const property = url.searchParams.get('property');
    const value = url.searchParams.get('value');
    const result = task1(property, value);

    endResponse(result);
    return;
  }

  if (method === 'GET' && url.pathname === '/task2') {
    const result = task2();
    endResponse(result);
    return;
  }

  if (method === 'GET' && url.pathname === '/task3') {
    const result = task3();
    endResponse(result);
    return;
  }

  if (method === 'POST' && url === '/store') {
    setStore(body);
    endResponse();
    return;
  }

  if (method === 'GET' && url.pathname === '/store/switch') {
    switchStore();
    endResponse();
    return;
  }

  if (method === 'GET' && url.pathname === '/upload') {
    try {
      const fileList = await getUploadFileList();
      endResponse(fileList);
    } catch (err) {
      console.error('Failed to get file list', err);
      endResponse({ status: 'error' }, 500);
    }
    return;
  }

  if (method === 'POST' && urlPath.dir === '/upload/optimize') {
    const fileName = urlPath.base;

    const { files: uploadFiles } = await getUploadFileList();
    if (!uploadFiles.includes(fileName)) {
      console.error(`File not found: ${fileName}`);
      endResponse({ status: 'error', message: 'File not found' }, 404);
      return;
    }

    optimizeJson(fileName).catch((err) => {
      console.error('Failed start optimization process', err);
      endResponse({ status: 'error' }, 500);
    });

    endResponse({ status: 'processing' }, 202);
    return;
  }

  notFound(response);
}

module.exports = {
  handleRoutes,
  handleStreamRoutes,
};
