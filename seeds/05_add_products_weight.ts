import * as Knex from "knex";


const ProductWeight = {
    jeans: 0.4,
    gloves: 0.1,
    hat: 0.2,
    socks: 0.1,
    shirt: 0.3,
    DEFAULT: 0
}

export async function seed(knex: Knex): Promise<void> {
    const allProducts = await knex("products")
        .join('types', `products.type_id`, `types.id`)
        .select('products.id', 'types.type');

    const allProductsWithWeight = allProducts.map(({ id, type }) => ({
        id,
        weight: ProductWeight[type] || ProductWeight.DEFAULT,
    }));

    const updateQueries = allProductsWithWeight.map(({ id, weight }) => {
        return knex('products').where({ id }).update({ weight });
    });

    return await knex.transaction((trx) => {
        Promise.all(updateQueries)
            .then(trx.commit)
            .catch(trx.rollback);
    });
};
