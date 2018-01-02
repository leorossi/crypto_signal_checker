'use strict';

const request = require('request');

const BittrexDataRetriever = function BittrexDataRetriever({}) {
  this.baseUrl = 'https://bittrex.com/Api/v2.0/pub/market/GetTicks';
};

/**
 * Get data from bittrex
 * @param {String} coinName the coin ticker name 
 * @param {Number} interval interval in minutes. Accepted values are: 1, 5, 60. Defaults to 5. 
 */
BittrexDataRetriever.prototype.getData = function(coinName, interval) {
  return new Promise((resolve, reject) => {
    let url = `${this.baseUrl}?marketName=BTC-${coinName}&tickInterval=${this.convertInterval(interval)}`
    request({
      url: url,
      json: true
    }, (err, res, body) => {
      if (body.success == false) {
        return reject(new Error('Cannot get data from Bittrex. Returned ' + body.message));
      }
      return resolve(body.result);
    });
  });
}

BittrexDataRetriever.prototype.convertInterval = function (intervalValue) {
  const defaultInterval = 'fiveMin';
  switch (intervalValue) {
    case 1:
      return 'oneMin';
    case 5:
      return 'fiveMin';
    case 60:
      return 'hour';
    default:
      return defaultInterval
  }
};
module.exports = BittrexDataRetriever;