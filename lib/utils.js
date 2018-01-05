'use strict';

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
  return (100 - (Math.round(percent * 100) / 100)).toFixed(2);
};
module.exports = Utils;