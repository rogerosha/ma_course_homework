const { name, password } = require('../../config/index.js');

function checkLogIn(req, res, next) {
  const auth = req.headers.authorization.split(' ');
  const { userName, userPass } = Buffer.from(auth, 'base64').toString();
  if (name === userName && password === userPass) {
    return next();
  }
  return 0;
}

module.exports = {
  checkLogIn,
};
