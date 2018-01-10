'use strict';

const async = require('async');
const dotenv = require('dotenv').config();
const container = require('../lib/container');
const Table = require('easy-table');

const BittrexManager = container.resolve('BittrexManager');
const CoinConverter = container.resolve('CoinConverter');
const Utils = container.resolve('Utils');

BittrexManager.getOrderHistory()
  .then((orders) => {
    let totalGain = 0;
    const data = findBuyAndSell(orders);
    const mainTable = new Table();
    const otherTable = new Table();
    for (var market in data) {
      let buyPrices = [];
      let averageBuyPrice;
      let qtyLeft = 0;
      data[market].reverse();
      for (var order of data[market]) {
        if (order.type === 'BUY') {
          buyPrices.push(order.unitPrice);
          qtyLeft += order.qty;
          averageBuyPrice = calculateAveragePrice(buyPrices);
        } else {
          // sell order
          let targetTable = mainTable;
          let performance = 0;
          let gain = 0
          if (undefined !== averageBuyPrice) {
            performance = profitLossForTrade([averageBuyPrice], [order.unitPrice]);  
            gain = (order.unitPrice * order.qty) - (averageBuyPrice * order.qty)
            totalGain += gain;
            qtyLeft -= order.qty;
          } else {
            targetTable = otherTable;
          }
          targetTable.cell('Date', Utils.readableDate(order.date, true)),
          targetTable.cell('Market', market);
          targetTable.cell('Quantity', order.qty);
          targetTable.cell('Bought at', averageBuyPrice);
          targetTable.cell('Sold at', order.unitPrice);
          targetTable.cell('Gain', ((order.unitPrice * order.qty) - (averageBuyPrice * order.qty)).toFixed(8));
          targetTable.cell('Performance', Utils.getColoredPercentageText(performance));
          targetTable.newRow(); 

          averageBuyPrice = null;
          buyPrices = [];
        }
      }
    }
    // Total Gain
    mainTable.total('Gain', {
      printer: (val, width) => {
        return `${val.toFixed(8)}`
      },
      reduce: function (acc, val, idx, len) {
        return acc + parseFloat(val);
      }
    })

    // Avg Gain
    mainTable.total('Performance', {
      printer: (val, width) => {
        return `Avg: ${val.toFixed(2)} %`
      },
      reduce: function (acc, val, idx, len) {
        acc = acc + parseFloat(val);
        return idx + 1 == len ? acc / len : acc
      }
    })
    mainTable.sort('Date');
    console.log('========== Buy/Sell trades =============')
    console.log(mainTable.toString());
    console.log('========== Other trades =============')
    console.log(otherTable.toString());
  })
  .catch((err) => {
    console.log(err);
  })


function findBuyAndSell(orders) {
  const markets = {};
  const buys = [];
  const sells = [];
  orders.map((o) => {
    if (undefined === markets[o.Exchange]) {
      markets[o.Exchange] = [];
    }
    markets[o.Exchange].push({
      type: o.OrderType === 'LIMIT_BUY' ? 'BUY' : 'SELL',
      date: o.Closed,
      unitPrice: o.PricePerUnit,
      qty: o.Quantity,
      commission: o.Commission
    })
  });
  return markets;
}

function profitLossForTrade(buys, sells) {
  const averageBuyPrice = calculateAveragePrice(buys);
  const averageSellPrice = calculateAveragePrice(sells);
  return Utils.profitLoss(averageBuyPrice, averageSellPrice);
}

function calculateAveragePrice(prices) {
  return prices.reduce((subtotal, current) => {
    return subtotal + current;
  }, 0) / prices.length;
}