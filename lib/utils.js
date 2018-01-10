'use strict';
const color = require('colors');
const moment = require('moment');
const Utils = {};

Utils.readableDate = function(date, includeTime) {
  let format = 'YYYY-MM-DD';
  if (includeTime) {
    format += ' HH:mm';
  }
  return moment(date).format(format);
};

Utils.priceDifference = function(target, current) {
  const percent = (current * 100) / target;
  return (100 - (Math.round(percent * 100) / 100));
};

Utils.profitLoss = function(buy, sell) {
  const percent = (sell * 100) / buy;
  return (Math.round(percent * 100) / 100) - 100;
}

Utils.getColoredPercentageText = function(value) {
  const percent = `${value.toFixed(2)} %`;
  if (value > 0) {
    return percent.green;
  }
  return percent.red;
}
module.exports = Utils;