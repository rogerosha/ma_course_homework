const { Router } = require('@awaitjs/express');

const { user } = require('../../config/index');
const { generateAccessToken } = require('../middlewares/index');

const loginRouter = Router();

loginRouter.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log({ username, password, user });
    if (username !== user.name || password !== user.password) {
      throw new Error('Incorrect username or password. Please, try again.');
    }
    const token = generateAccessToken(username);

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = {
  loginRouter,
};
