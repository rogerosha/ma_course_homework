// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.message);
  switch (err.message) {
    case 'Authorize':
      res.status(403).json({ error: 'Authorization failed' });
      break;
    default:
      res.status(500).json({ error: 'Server error' });
      break;
  }
}

function notFound(req, res, next) {
  if (!req.route) {
    res.status(404).json({ status: 'not found' });
  }
  return next();
}

module.exports = {
  errorHandler,
  notFound,
};
