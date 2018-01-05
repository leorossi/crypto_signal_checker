'use strict';
const async = require('async');
const dotenv = require('dotenv').config();
const container = require('../lib/container');
const Table = require('easy-table');

const BittrexManager = container.resolve('BittrexManager');
const CoinConverter = container.resolve('CoinConverter');
const Utils = container.resolve('Utils');
BittrexManager.getOpenOrders()
  .then((orders) => {
    const t = new Table();
    async.each(orders, (currentOrder, nextOrder) => {
      BittrexManager.getMarketSummary(currentOrder.Exchange)
        .then((market) => {
          t.cell('Date', Utils.readableDate(currentOrder.Opened, true)),
          t.cell('Market', currentOrder.Exchange);
          t.cell('Order Type', currentOrder.OrderType);
          t.cell('Target Price', currentOrder.Limit);
          t.cell('Current Price', market.Last);
          t.cell('Price Delta', `${Utils.priceDifference(currentOrder.Limit, market.Last)} %`);
          t.newRow();
          return nextOrder();
        });
    }, (err) => {
      console.log(t.toString());
    });    
  });