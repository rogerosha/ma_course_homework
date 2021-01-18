const tasks = require('./tasks');
const { adminsTable } = require('../db/knex');
const { AdminService } = require('./adminService');
const { AuthorizationService } = require('./authorizationService');
const { CryptoService, cryptoService } = require('./cryptoService');

const authorizationService = new AuthorizationService();
const adminService = new AdminService(adminsTable, authorizationService, cryptoService);

module.exports = {
  AdminService,
  adminService,
  AuthorizationService,
  authorizationService,
  CryptoService,
  cryptoService,
  tasks,
};
