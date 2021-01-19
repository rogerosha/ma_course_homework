import * as Knex from "knex";
import { ordersTable } from '../src/db/knex';

interface Order {
    destination: string;
    product_id: number;
    quantity: number;
    status?: 0 | 1 | 2;
}

const orders: Order[] = [
    { destination: 'Хмельницький', product_id: 1, quantity: 5, status: 0 },
    { destination: 'Київ', product_id: 2, quantity: 2, status: 0 },
    { destination: 'Львів', product_id: 3, quantity: 1, status: 1 },
    { destination: 'Харків', product_id: 4, quantity: 5, status: 2 },
];


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("orders").del();
    
    const ordersRequests = orders.map(({ destination, product_id, quantity, status }) => ordersTable.createOrder(product_id, destination, quantity, status));

    return await knex.transaction((trx) => {
        Promise.all(ordersRequests)
            .then(trx.commit)
            .catch(trx.rollback);
    });
};
