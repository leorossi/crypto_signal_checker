'use strict';
const moment = require('moment');
const request = require('request');

const CoinConverter = function CoinConverter({}) {
  this.baseUrl = 'https://min-api.cryptocompare.com/data/pricehistorical';
};


CoinConverter.prototype.convert = function(from, to, value, date) {
  const url = `${this.baseUrl}?fsym=${from.toUpperCase()}&tsyms=${to.toUpperCase()}&ts=${moment(date).unix()}`;
  return new Promise((resolve, reject) => {
    request({
      url: url,
      json: true,
    }, (err, resp, body) => {
      if (err) {
        return reject(err);
      }
      const rate = body[from][to];
      return resolve(Math.round(value * rate));
    });
  });
}
module.exports = CoinConverter;