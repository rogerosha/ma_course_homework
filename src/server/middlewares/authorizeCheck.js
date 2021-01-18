const { authorizationService } = require('../../services');
const { adminService } = require('../../services');
const { adminsTable } = require('../../db');

module.exports = async (req, res, next) => {
  try {
    const token = await authorizationService.getAuthToken(req);

    if (!token) {
      throw new Error('Failed to get authorization token!');
    }

    const checkToken = await authorizationService.checkAccessToken(token);

    if (!checkToken) {
      throw new Error('Failed to check access token!');
    }

    const username = await adminService.getUsernameFromToken(token);
    const dbAdminToken = await adminsTable.getAdminRefreshToken(username);

    if (!dbAdminToken) {
      throw new Error('Failed to get refresh token!');
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
