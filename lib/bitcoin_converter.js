'use strict';

const BitcoinConverter = function BitcoinConverter({}) {

};
/**
 * Return number of satoshis (1 hundred milionth part of BTC)
 * @param {Number} value BTC to convert
 */
BitcoinConverter.prototype.toSatoshis = function(value) {
  return Math.round(value * 100 * 1000 * 1000);
}
module.exports = BitcoinConverter;