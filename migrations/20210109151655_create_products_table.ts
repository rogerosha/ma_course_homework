import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('products', (table) => {
    table.increments().primary();
    table.integer('type_id').references('id').inTable('types').notNullable();
    table
      .integer('color_id')
      .references('id')
      .inTable('colors')
      .notNullable();
    table.decimal('price').notNullable().defaultTo(0);
    table.unique(['color_id', 'type_id', 'price']);
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamps(false, true);
    table.timestamp('deleted_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('products');
}

