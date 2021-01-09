// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

class TypesTable {
  /**
   * @param {Knex} knex
   */
  constructor(knex) {
    this.knex = knex;
    this.TABLE_NAME = 'types';
  }

  createType(type) {
    return this.knex(this.TABLE_NAME)
      .insert({ type })
      .returning('*')
      .onConflict('type')
      .merge()
      .returning('*')
      .then(([createdType]) => createdType);
  }

  getTypeById(id) {
    return this.knex(this.TABLE_NAME)
      .where({ id })
      .whereNull('deleted_at')
      .then(([foundType]) => foundType);
  }

  getTypeIdByType(type) {
    return this.knex(this.TABLE_NAME)
      .where({ type })
      .whereNull('deleted_at')
      .then(([typeItem]) => (typeItem ? typeItem.id : null));
  }

  getAllTypes() {
    return this.knex(this.TABLE_NAME).whereNull('deleted_at');
  }

  updateType(id, type) {
    const updateType = JSON.parse(JSON.stringify(type));
    updateType.updated_at = new Date();

    return this.knex(this.TABLE_NAME)
      .update(updateType)
      .where({ id })
      .returning('*')
      .then(([updatedType]) => updatedType);
  }

  deleteType(id) {
    return this.knex(this.TABLE_NAME)
      .where({ id })
      .update({ deleted_at: new Date() })
      .then(() => ({ status: true }));
  }
}

module.exports = {
  TypesTable,
};
