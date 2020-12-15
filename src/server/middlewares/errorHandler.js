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

module.exports = {
  errorHandler,
};
