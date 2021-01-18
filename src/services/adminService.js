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

  refreshTokens(refreshToken) {
    const refrTokens = this.authorizationService.generateRefreshToken({ refreshToken });
    return refrTokens;
  }

  // eslint-disable-next-line consistent-return
  logout(refreshToken) {
    const checkOut = this.adminsTable.deleteAdminRefreshToken({ refreshToken });
    if (checkOut === null) {
      return { status: true };
    }
  }
}

module.exports = {
  AdminService,
};
