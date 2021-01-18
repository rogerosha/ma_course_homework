/* eslint-disable no-unused-vars */
const Knex = require('knex');
const { CryptoService } = require('../../../services');

class AdminsTable {
  /**
   * @param {Knex} knex
   * @param {CryptoService} cryptoService
   */
  constructor(knex, cryptoService) {
    this.knex = knex;
    this.cryptoService = cryptoService;
    this.TABLE_NAME = 'admins';
  }

  createAdmin({ username, password }) {
    const hash = this.cryptoService.createHash(username, password);
    return this.knex(this.TABLE_NAME)
      .insert({ username, hash })
      .returning('*')
      .onConflict('username')
      .merge()
      .returning('*');
  }

  getAdminRefreshToken(username) {
    return this.knex(this.TABLE_NAME).where({ username }).select('refresh-token').first();
  }

  updateAdminRefreshToken({ username, hash, refreshToken }) {
    return (
      this.knex(this.TABLE_NAME)
        // eslint-disable-next-line consistent-return
        .where((builder) => {
          if (username) {
            return builder.where({ username });
          }
          if (hash) {
            return builder.where({ hash });
          }
        })
        .update({ 'refresh-token': refreshToken, updated_at: new Date() })
    );
  }

  deleteAdminRefreshToken(username) {
    return this.updateAdminRefreshToken({ username, refreshToken: null });
  }
}

module.exports = {
  AdminsTable,
};
