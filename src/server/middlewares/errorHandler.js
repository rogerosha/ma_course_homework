function errorHandler(err, req, res, next) {
  console.error(err);
  switch (err.name) {
    case 'Fail':
      res.status(403).json({ error: 'Authorization failed' });
      break;
    default:
      res.status(500).json({ error: 'Server error' });
      break;
  }
  return next();
}

module.exports = {
  errorHandler,
};
