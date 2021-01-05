/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */

const { config, closeProgram } = require('../config');

const db = {};
let type = config.defaultType;

const funcWrapper = (func) =>
  typeof func === 'function'
    ? func
    : closeProgram(`FATAL: Cannot find ${func.name} function for current DB wrapper`);

async function init() {
  try {
    for (const [key] of Object.entries(config.db.config)) {
      const wrapper = require(`./${key}`);
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${key} initiated`);
      db[key] = wrapper;
    }
  } catch (err) {
    closeProgram(`FATAL: ${err.message || err}`, err);
  }
}

async function end() {
  for (const [key, value] of Object.entries(db)) {
    await value.close();
    console.log(`INFO: DB wrapper for ${key} was closed`);
  }
}

async function setType(t) {
  if (!t || !db[t]) {
    console.log(`WARNING: Cannot find provided DB type!`);
    return false;
  }
  // eslint-disable-next-line no-const-assign
  type = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
}

const getType = () => type;

const dbWrapper = (t) => db[t] || db[type];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,
  //-------------------

  testConnection: async () => funcWrapper(dbWrapper().testConnection)(),
  close: async () => funcWrapper(dbWrapper().close)(),
  createProduct: async (product) => funcWrapper(dbWrapper().createProduct)(product),
  getProduct: async (id) => funcWrapper(dbWrapper().getProduct)(id),
  updateProduct: async (product) => funcWrapper(dbWrapper().updateProduct)(product),
  deleteProduct: async (id) => funcWrapper(dbWrapper().deleteProduct)(id),
};
