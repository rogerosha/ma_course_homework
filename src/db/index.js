/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable no-shadow */

const {
  db: { config, defaultType },
  closeProgram,
} = require('../config');

const db = {};
const type = defaultType;

async function init() {
  try {
    for (const [key, value] of Object.entries(config)) {
      const wrapper = require(`./${key}`)(value);
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${key} initiated`);
      db[key] = wrapper;
    }
  } catch (err) {
    closeProgram(`FATAL: ${err.message || err}`);
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
};
