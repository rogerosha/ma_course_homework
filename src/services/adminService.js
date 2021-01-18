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
    const tokens = await this.authorizationService.generateAllTokens({ username });
    const hash = this.cryptoService.createHash(username, password);
    await this.adminsTable.updateAdminRefreshToken({ hash, refreshToken: tokens.refreshToken });
    return tokens;
  }

  async refreshToken(token) {
    const username = await this.getUsernameFromToken(token);

    const newTokens = await this.authorizationService.generateAllTokens({ username });
    const dbAdminToken = await this.adminsTable.getAdminRefreshToken(username);

    if (!dbAdminToken) {
      throw new Error('There is no token for this admin');
    }

    if (dbAdminToken !== newTokens.refreshToken) {
      throw new Error('Incorrect username or password');
    }

    await this.adminsTable.updateAdminRefreshToken({
      username,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens;
  }

  async logout(token) {
    const username = await this.getUsernameFromToken(token);
    const checkOut = await this.adminsTable.deleteAdminRefreshToken({ username });
    return { status: checkOut === null };
  }

  /**
   * @private
   */
  async getUsernameFromToken(refreshToken) {
    const { username } = await this.authorizationService.checkRefreshToken(refreshToken);

    if (!username) {
      throw new Error('Incorrect token');
    }

    return username;
  }
}

module.exports = {
  AdminService,
};
