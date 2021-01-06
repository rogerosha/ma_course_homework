/* eslint-disable no-unused-vars */
const { ColorsTable, TypesTable, ProductsTable } = require('./knex/tables');

class CsvAdapter {
  /**
   * @param {ProductsTable} productsTable
   * @param {ColorsTable} colorsTable
   * @param {TypesTable} typesTable
   */
  constructor(productsTable, colorsTable, typesTable) {
    this.productsTable = productsTable;
    this.colorsTable = colorsTable;
    this.typesTable = typesTable;
  }

  async fillDatabaseFromJSON(json) {
    const requests = json.map(async (product) => {
      const productCopy = JSON.parse(JSON.stringify(product));
      productCopy.price = +productCopy.price.split('$')[1];

      await this.colorsTable.createColor(productCopy.color);
      await this.typesTable.createType(productCopy.type);
      await this.productsTable.createProduct(productCopy);
    });

    await Promise.all(requests);
    console.log(new Date(), `DEBUG: Database filled with ${json.length} products!`);
  }
}

module.exports = {
  CsvAdapter,
};
