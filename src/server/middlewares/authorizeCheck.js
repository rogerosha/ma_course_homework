const { user } = require('../../config');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.split(/\s+/).pop() || '';
    const auth = Buffer.from(token, 'base64').toString();
    const parts = auth.split(/:/);
    const authUsername = parts[0] || '';
    const authPassword = parts[1] || '';

    if (authUsername === user.name && authPassword === user.password) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid username or password!' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid request!' });
  }
};
