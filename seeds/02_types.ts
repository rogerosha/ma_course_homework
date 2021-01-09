import * as Knex from "knex";
import {readFileSync} from "fs";

const sql = readFileSync(`${process.cwd()}/seeds/02_types.sql`, {encoding: 'utf-8'});

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("types").del();

    // Inserts seed entries
    await knex.raw(sql);
};
