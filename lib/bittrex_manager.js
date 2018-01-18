'use strict';

const bittrexApi = require('node-bittrex-api');

const BittrexManager = function BittrexManager({}) {
  bittrexApi.options({
    apikey: process.env.BITTREX_API_KEY,
    apisecret: process.env.BITTREX_API_SECRET,
    inverse_callback_arguments: true
  });
  this.api = bittrexApi;
  this.currentMarkets = null;
};


BittrexManager.prototype.getTotalDeposits = function() {
  return new Promise((resolve, reject) => {
    this.api.getdeposithistory({}, (err, data) => {
      if (err) {
        console.log(err.error.stack);
        return;
      }

      if (data.success) {
        const output = data.result.map((deposit) => {
          return {
            currency: deposit.Currency,
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

BittrexManager.prototype.getMarketSummary = function(marketName) {
  let that = this;
  return new Promise((resolve, reject) => {
    if (this.currentMarkets === null) {
      this.api.getmarketsummaries((err, data) => {
        if (err) return reject(err);
        this.currentMarkets = data.result;
        return _onMarketLoaded();
      });
    } else {
      return _onMarketLoaded();
    }

    function _onMarketLoaded() {
      for (let market in that.currentMarkets) {
        if (that.currentMarkets[market].MarketName === marketName) {
          return resolve(that.currentMarkets[market]);
        }
      }
      return reject(new Error('Cannot find market ' + marketName));
    }
  });
};

BittrexManager.prototype.getOpenOrders = function() {
  return new Promise((resolve, reject) => {
    this.api.getopenorders({}, (err, data) => {
      if (err) return reject(err);
      return resolve(data.result);
    });
  });
};

BittrexManager.prototype.getOrderHistory = function () {
  return new Promise((resolve, reject) => {
    this.api.getorderhistory({}, (err, data) => {
      if (err) return reject(err);
      return resolve(data.result);
    });
  });
};

module.exports = BittrexManager;
