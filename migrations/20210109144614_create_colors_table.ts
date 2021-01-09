import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('colors', (table) => {
    table.increments().primary();
    table.string('color').notNullable().unique();
    table.timestamps(false, true);
    table.timestamp('deleted_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('colors');
}

