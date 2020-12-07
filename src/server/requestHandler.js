const { parse: parseQuery } = require('querystring');
const { URL } = require('url');
const { handleStreamRoutes, handleRoutes } = require('./router.js');

module.exports = async (request, response) => {
  try {
    const { url } = request;
    const parsedUrl = new URL(url, process.env.ORIGIN);
    const queryParams = parseQuery(parsedUrl.search.substr(1));

    if (request.headers['content-type'] === 'text/csv') {
      handleStreamRoutes(request, response).catch((err) =>
        console.error('CSV handler failed', err),
      );
      return;
    }

    let body = [];

    request
      .on('error', (err) => {
        console.error(err);
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        handleRoutes(
          {
            ...request,
            body: body ? JSON.parse(body) : {},
            url,
            queryParams,
          },
          response,
        );
      });
  } catch (error) {
    console.log(error);
  }
};
