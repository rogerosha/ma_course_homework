const crypto = require('crypto');
const { config } = require('../config');

class CryptoService {
  // eslint-disable-next-line class-methods-use-this
  createHash(username, password) {
    return crypto
      .createHmac('sha256', config.hash_secret)
      .update(username)
      .update(password)
      .digest('hex');
  }
}

const cryptoService = new CryptoService();

module.exports = {
  CryptoService,
  cryptoService,
};
