import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return await knex.schema.createTable('orders', (table) => {
    table
      .uuid('uuid')
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary();
    table.string('destination', 36).notNullable();
    table.integer('product_id').references('id').inTable('products').notNullable();
    table.integer('quantity').notNullable().defaultTo(1);
    table.integer('status', 100).notNullable();
    table.decimal('price').notNullable();
    table.timestamps(false, true);
    table.timestamp('deleted_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('orders');
}

