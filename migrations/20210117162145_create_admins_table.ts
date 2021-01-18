import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('admins', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('hash').notNullable();
    table.string('refresh-token');
    table.timestamps(false, true);
    table.timestamp('deleted_at');
    table.unique(['username']);
  });
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('admins');
}
