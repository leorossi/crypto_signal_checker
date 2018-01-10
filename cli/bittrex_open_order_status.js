'use strict';
const async = require('async');
const dotenv = require('dotenv').config();
const container = require('../lib/container');
const Table = require('easy-table');

const BittrexManager = container.resolve('BittrexManager');
const CoinConverter = container.resolve('CoinConverter');
const Utils = container.resolve('Utils');
Promise.all([
  BittrexManager.getOrderHistory(),
  BittrexManager.getOpenOrders()  
])
.then(( [orderHistory, openOrders] ) => {
  const orders = openOrders;
  const t = new Table();
  async.each(orders, (currentOrder, nextOrder) => {
    BittrexManager.getMarketSummary(currentOrder.Exchange)
      .then((market) => {
        const buyOrders = findBuyOrderForMarket(orderHistory, currentOrder.Exchange);
        const buyPrice = buyOrders[0].unitPrice
        t.cell('Date', Utils.readableDate(currentOrder.Opened, true)),
        t.cell('Market', currentOrder.Exchange);
        t.cell('Order Type', currentOrder.OrderType);
        t.cell('Buy Price', buyPrice);
        t.cell('Target Price', currentOrder.Limit);
        t.cell('Current Price', market.Last);
        t.cell('Buy / Current', `${Utils.getColoredPercentageText(Utils.profitLoss(buyPrice, market.Last))}`);
        t.cell('Target / Current', `${Utils.priceDifference(currentOrder.Limit, market.Last).toFixed(2)} %`);
        t.cell('Condition', currentOrder.IsConditional ? `${currentOrder.Condition} ${currentOrder.ConditionTarget}` : '');
        t.newRow();
        return nextOrder();
      });
  }, (err) => {
    t.sort('Date');
    console.log(t.toString());
  });    
}).catch((err) => {
  console.log(err);
});


function findBuyOrderForMarket(orders, market) {
  const buys = [];
  const sells = [];
  const output = orders.filter((o) => {
    return o.Exchange === market
  }).filter((o) => {
    return o.OrderType === 'LIMIT_BUY';
  }).map((o) => {
    return {
      type: 'BUY',
      date: o.Closed,
      unitPrice: o.PricePerUnit,
      qty: o.Quantity,
      commission: o.Commission
    }
  });
  if (!output) { console.log(market); return [] }
  return output;
}

function calculateAverageBuyPrice(buyOrders) {

}