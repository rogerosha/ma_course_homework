const jwt = require('jsonwebtoken');

const { config } = require('../config');

class AuthorizationService {
  /**
   * @private
   * @returns {Promise<string>}
   */
  // eslint-disable-next-line class-methods-use-this
  generateToken(data, secretKey, expiresIn) {
    return new Promise((resolve, reject) => {
      jwt.sign(data, secretKey, { expiresIn }, (err, token) => {
        if (token) {
          return resolve(token);
        }
        return reject(err);
      });
    });
  }

  /**
   * @private
   * @returns {Promise<any>}
   */
  // eslint-disable-next-line class-methods-use-this
  checkToken(data, secretKey) {
    return new Promise((resolve, reject) => {
      jwt.verify(data, secretKey, (err, token) => {
        if (token) {
          return resolve(token);
        }
        return reject(err);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getAuthToken(req) {
    const header = req.headers.authorization || '';
    const token = header.split(/\s+/).pop() || '';
    return token;
  }

  generateAccessToken(data) {
    return this.generateToken(data, config.access_token_key, config.access_token_life);
  }

  checkAccessToken(data) {
    return this.checkToken(data, config.access_token_key);
  }

  generateRefreshToken(data) {
    return this.generateToken(data, config.refresh_token_key, config.refresh_token_life);
  }

  checkRefreshToken(data) {
    return this.checkToken(data, config.refresh_token_key);
  }

  async generateAllTokens(data) {
    return {
      refreshToken: await this.generateRefreshToken(data),
      token: await this.generateAccessToken(data),
    };
  }
}

module.exports = {
  AuthorizationService,
};
