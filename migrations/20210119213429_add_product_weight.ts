import * as Knex from "knex";



export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('products', (table) => {
    table.decimal('weight').defaultTo(0).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('products', (table) => {
    return table.dropColumn('weight');
  });
}
