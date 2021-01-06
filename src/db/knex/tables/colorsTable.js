// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

class ColorsTable {
  /**
   * @param {Knex} knex
   */
  constructor(knex) {
    this.knex = knex;
    this.TABLE_NAME = 'colors';
  }

  async createTable() {
    const isTableExists = await this.knex.schema.hasTable(this.TABLE_NAME);
    if (isTableExists) {
      console.log(`Table ${this.TABLE_NAME} is already created`);
    } else {
      await this.knex.schema.createTable(this.TABLE_NAME, (table) => {
        table.increments();
        table.string('color').notNullable().unique();
        table.timestamps(false, true);
        table.timestamp('deleted_at');
      });
      console.log(`Table ${this.TABLE_NAME} has been created`);
    }
  }

  createColor(color) {
    return this.knex(this.TABLE_NAME)
      .insert({ color })
      .returning('*')
      .onConflict('color')
      .merge()
      .returning('*')
      .then(([createdColor]) => createdColor);
  }

  getColorById(id) {
    return this.knex(this.TABLE_NAME)
      .where({ id })
      .whereNull('deleted_at')
      .then(([foundColor]) => foundColor);
  }

  getColorIdByColor(color) {
    return this.knex(this.TABLE_NAME)
      .where({ color })
      .whereNull('deleted_at')
      .then(([colorItem]) => (colorItem ? colorItem.id : null));
  }

  getAllColors() {
    return this.knex(this.TABLE_NAME).whereNull('deleted_at');
  }

  updateColor(id, color) {
    const updateColor = JSON.parse(JSON.stringify(color));
    updateColor.updated_at = new Date();

    return this.knex(this.TABLE_NAME)
      .update(updateColor)
      .where({ id })
      .returning('*')
      .then(([updatedColor]) => updatedColor);
  }

  deleteColor(id) {
    return this.knex(this.TABLE_NAME)
      .where({ id })
      .update({ deleted_at: new Date() })
      .then(() => ({ status: true }));
  }
}

module.exports = {
  ColorsTable,
};
