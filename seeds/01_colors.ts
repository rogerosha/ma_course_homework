import * as Knex from "knex";

interface Color {
  id: number;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const colors: Color[] = [
  { id: 1, color: 'red', created_at: '2021-01-09 12:35:33.539108+00', updated_at: '2021-01-09 12:35:33.539108+00' },{ id: 2, color: 'purple', created_at: '2021-01-09 12:35:33.632083+00', updated_at: '2021-01-09 12:35:33.632083+00' },
  { id: 3, color: 'navy', created_at: '2021-01-09 12:35:33.667558+00', updated_at: '2021-01-09 12:35:33.667558+00' },
  { id: 4, color: 'black', created_at: '2021-01-09 12:35:33.709908+00', updated_at: '2021-01-09 12:35:33.709908+00' },
  { id: 5, color: 'lime', created_at: '2021-01-09 12:35:33.72073+00', updated_at: '2021-01-09 12:35:33.72073+00' },
  { id: 6, color: 'white', created_at: '2021-01-09 12:35:54.72073+00', updated_at: '2021-01-09 12:35:54.72073+00', deleted_at: '2021-01-09 12:35:54.72073+00' },
]

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("colors").del();

  // Inserts seed entries
  await knex("colors").insert(colors);
};
