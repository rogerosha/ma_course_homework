import * as Knex from "knex";

interface Product {
  id: number;
  type_id: number;
  color_id: number;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const products: Product[] = [
  { id: 1, type_id: 2, color_id: 4, price: 15, quantity: 1920, created_at: '2021-01-09 13:52:10.224974+00', updated_at: '2021-01-09 13:52:10.224974+00' },
  { id: 2, type_id: 4, color_id: 1, price: 10, quantity: 3328, created_at: '2021-01-09 13:52:10.224992+00', updated_at: '2021-01-09 13:52:10.224992+00' },
  { id: 3, type_id: 4, color_id: 1, price: 2, quantity: 3824, created_at: '2021-01-09 13:52:10.246997+00', updated_at: '2021-01-09 13:52:10.246997+00' },
  { id: 4, type_id: 4, color_id: 2, price: 2, quantity: 1024, created_at: '2021-01-09 13:52:10.247015+00', updated_at: '2021-01-09 13:52:10.247015+00' },
  { id: 5, type_id: 1, color_id: 3, price: 35, quantity: 512, created_at: '2021-01-09 13:52:10.245625+00', updated_at: '2021-01-09 13:52:10.245625+00' },
  { id: 6, type_id: 3, color_id: 5, price: 7, quantity: 384, created_at: '2021-01-09 13:52:10.247845+00', updated_at: '2021-01-09 13:52:10.247845+00' },
  { id: 7, type_id: 5, color_id: 2, price: 2.28, quantity: 228, created_at: '2021-01-09 13:55:10.224974+00', updated_at: '2021-01-09 13:55:10.224974+00', deleted_at: '2021-01-09 13:55:10.224974+00' },
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("products").del();

    // Inserts seed entries
    await knex("products").insert(products);
};
