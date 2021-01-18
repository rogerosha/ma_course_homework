/* eslint-disable no-unused-vars */
const { AdminsTable } = require('../db/knex/tables/adminsTable');
const { AuthorizationService } = require('./authorizationService');
const { CryptoService } = require('./cryptoService');

class AdminService {
  /**
   * @param {AdminsTable} adminsTable
   * @param {AuthorizationService} authorizationService
   * @param {CryptoService} cryptoService
   */
  constructor(adminsTable, authorizationService, cryptoService) {
    this.adminsTable = adminsTable;
    this.authorizationService = authorizationService;
    this.cryptoService = cryptoService;
  }

  async login(username, password) {
    const newTokens = await this.authorizationService.generateAllTokens({ username });
    const hash = this.cryptoService.createHash(username, password);
    const isUpdated = await this.adminsTable.updateAdminRefreshToken({
      hash,
      refreshToken: newTokens.refreshToken,
    });

    if (!isUpdated) {
      throw new Error('Wrong username or password');
    }

    return newTokens;
  }

  async refreshToken(token) {
    const username = await this.getUsernameFromToken(token);

    const newTokens = await this.authorizationService.generateAllTokens({ username });
    const dbAdminToken = await this.adminsTable.getAdminRefreshToken(username);

    if (!dbAdminToken) {
      throw new Error('There is no token for this admin');
    }

    await this.adminsTable.updateAdminRefreshToken({
      username,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens;
  }

  async logout(token) {
    const username = await this.getUsernameFromToken(token);
    const status = await this.adminsTable.deleteAdminRefreshToken(username);
    return { status };
  }

  async getUsernameFromToken(refreshToken) {
    const { username } = await this.authorizationService.checkAccessToken(refreshToken);

    if (!username) {
      throw new Error('Incorrect token');
    }

    return username;
  }
}

module.exports = {
  AdminService,
};
