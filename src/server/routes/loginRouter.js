/* eslint-disable no-unused-vars */
const { Router } = require('@awaitjs/express');

const { user } = require('../../config/index');

const { adminService } = require('../../services');
const { authorizationService } = require('../../services');

const loginRouter = Router();

loginRouter.postAsync('/login', async (req, res) => {
  const { username, password } = req.body;
  const tokens = await adminService.login(username, password);
  return res.json({ tokens });
});

loginRouter.getAsync('/refresh', async (req, res) => {
  const token = await authorizationService.getAuthToken(req);
  const tokens = await adminService.refreshToken(token);
  return res.json({ tokens });
});

loginRouter.getAsync('/logout', async (req, res) => {
  const token = await authorizationService.getAuthToken(req);
  const result = await adminService.logout(token);
  return res.json(result);
});

module.exports = {
  loginRouter,
};
