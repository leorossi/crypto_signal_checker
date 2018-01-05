'use strict';
const dotenv = require('dotenv').config();
const container = require('../lib/container');

const BittrexManager = container.resolve('BittrexManager');
const CoinConverter = container.resolve('CoinConverter');

let totalBtc = 0;
BittrexManager.getTotalDeposits()
  .then((deposits) => {
    const promises = deposits.map((d) => {
      if (d.currency == 'BTC') {
        totalBtc += d.amount;
      }
      return CoinConverter.convert(d.currency, 'USD', d.amount, d.date);
    });
    return Promise.all(promises)
  })
  .then((values) => {
    const totalUsdSpent = values.reduce((acc, current) => {
      return acc + current;
    }, 0)
    console.log(`You spent ~ $${totalUsdSpent} on Bittrex`);
    console.log(`And you deposited ${Math.round(totalBtc * 10000000) / 10000000} BTC`);
  })
  .catch((err) => {
    console.log(err);
  });
