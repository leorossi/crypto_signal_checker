'use strict';
const moment = require('moment');
const request = require('request');
const BitcoinConverter = function BitcoinConverter({}) {

};
/**
 * Return number of satoshis (1 hundred milionth part of BTC)
 * @param {Number} value BTC to convert
 */
BitcoinConverter.prototype.toSatoshis = function(value) {
  return Math.round(value * 100 * 1000 * 1000);
}

/**
 * Return USD value (1 hundred milionth part of BTC)
 * @param {Number} value BTC to convert
 */
BitcoinConverter.prototype.toUsd = function (value, date) {
  function formatDate(date) {
    const base = moment(date);
    return base.startOf('day').format('YYYY-MM-DD');
  }
  return new Promise((resolve, reject) => {
    const options = {
      json: true
    };
    if (date) {
      options.url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${formatDate(date)}&end=${formatDate(date)}`
    } else {
      options.url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
    }
    return request(options, (err, res, data) => {
      if (err) { return reject(err); }
      const rate = data.bpi[formatDate(date)];
      return resolve(Math.round(value * rate));
    });
  });
}
module.exports = BitcoinConverter;