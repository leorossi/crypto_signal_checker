'use strict';

const bittrexApi = require('node-bittrex-api');

const BittrexManager = function BittrexManager({ BitcoinConverter }) {
  bittrexApi.options({
    apikey: process.env.BITTREX_API_KEY,
    apisecret: process.env.BITTREX_API_SECRET,
    inverse_callback_arguments: true
  });
  this.api = bittrexApi;
  this.converter = BitcoinConverter;
};


BittrexManager.prototype.getTotalDeposits = function() {
  return new Promise((resolve, reject) => {
    this.api.getdeposithistory({}, (err, data) => {
      if (data.success) {
        const output = data.result.map((deposit) => {
          return {
            date: deposit.LastUpdated,
            amount: deposit.Amount
          }
        });
        return resolve(output);
      } else {
        return reject(data.message);
      }
    });
  });
};

module.exports = BittrexManager;