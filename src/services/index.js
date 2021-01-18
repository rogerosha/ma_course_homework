const tasks = require('./tasks');
const { adminsTable } = require('../db/knex/tables');
const { AdminService } = require('./adminService');
const { AuthorizationService } = require('./authorizationService');
const { CryptoService } = require('./cryptoService');

const authorizationService = new AuthorizationService();
const cryptoService = new CryptoService();
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
