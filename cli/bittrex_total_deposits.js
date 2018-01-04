'use strict';
const dotenv = require('dotenv').config();
const container = require('../lib/container');

const BittrexManager = container.resolve('BittrexManager');
const BitcoinConverter = container.resolve('BitcoinConverter');

BittrexManager.getTotalDeposits()
  .then((deposits) => {
    const promises = deposits.map((d) => {
      return BitcoinConverter.toUsd(d.amount, d.date)
    });
    return Promise.all(promises)
  })
  .then((values) => {
    const totalUsdSpent = values.reduce((acc, current) => {
      return acc + current;
    }, 0)
    console.log(`You spent $${totalUsdSpent} on Bittrex :|`);
  });
