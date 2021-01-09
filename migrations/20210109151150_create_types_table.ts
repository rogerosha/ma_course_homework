import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('types', (table) => {
    table.increments().primary();
    table.string('type').notNullable().unique();
    table.timestamps(false, true);
    table.timestamp('deleted_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('types');
}

