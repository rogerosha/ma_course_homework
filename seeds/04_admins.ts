import * as Knex from "knex";
import { authorizationService, cryptoService } from "../src/services";

interface Admin {
    username: string;
    hash: string;
    'refresh-token': string;
}

async function getAdmins(): Promise<Admin[]> {
    return [
        {
            username: 'usernameExample',
            hash: cryptoService.createHash('usernameExample', 'passwordExample'),
            'refresh-token': await authorizationService.generateRefreshToken({ username: 'usernameExample' })
        },
    ]
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("admins").del();

    // Inserts seed entries
    await knex("admins").insert(await getAdmins());
};
