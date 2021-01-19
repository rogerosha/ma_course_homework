const NovaPoshta = require('novaposhta');
const { config } = require('../config');

global.fetch = require('node-fetch');

class NovaPoshtaService {
  constructor() {
    this.novaposhta = new NovaPoshta({ apiKey: config.novaPoshta.apiKey });
  }

  /**
   * Returns machinereadable cityRef for humanreadable cityName
   * @param {string} cityName - City name
   * @return {Promise<string>} - CityRef
   *
   * @example
   * await novaPoshtaService.getWarehouses('Черкаси') // returns 'test-test-test-test'
   */
  async getCityRefFromName(cityName) {
    const response = await this.novaposhta.address.getWarehouses({ CityName: cityName });
    try {
      return response.data[0].CityRef;
    } catch (err) {
      console.log(response);
      throw new Error(`Cannot find CityRef for ${cityName}`);
    }
  }

  /**
   * Returns price for shipment
   * @param {any} product - Product model
   * @param {string} destinationName - Destination city
   * @return {Promise<number>} - Cost of shipment
   *
   * @example
   * const product = { id: 1, quantity: 10, type: 'socks', color: 'red' };
   * await novaPoshtaService.getDocumentPrice(product, 'Хмельницький') // returns 500
   */
  async getShipmentPrice(product, destinationName) {
    const priceProperties = {
      CitySender: await this.getCityRefFromName(config.novaPoshta.warehouse),
      CityRecipient: await this.getCityRefFromName(destinationName),
      Weight: +product.weight,
      Cost: +product.price * +product.quantity,
    };

    const response = await this.novaposhta.internetDocument.getDocumentPrice(priceProperties);
    return response.data[0].Cost || response.data[0].CostDoorsWarehouse;
  }
}

const novaPoshtaService = new NovaPoshtaService();

module.exports = {
  NovaPoshtaService,
  novaPoshtaService,
};
