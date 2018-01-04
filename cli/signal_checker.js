'use strict';

// const prev = new Prevision({
//   coin: 'WAVES',
//   entryPrice: 1234,
//   targets: [ 2000, 2500, 3000]
// });

// prev.check();
const argv = require('optimist').argv;
const moment = require('moment');

const container = require('../lib/container');


const dataRetriever = container.resolve('BittrexDataRetriever');
const BitcoinConverter = container.resolve('BitcoinConverter');

if (undefined === argv.coin) {
  console.error('Error: no coin provided.');
  process.exit(1);
}
if (undefined === argv.buy) {
  console.error('Error: no buy price provided.');
  process.exit(1);
}

if (undefined === argv.date) {
  console.error('Error: no signal date provided.');
  process.exit(1);
}
dataRetriever.getData(argv.coin, 1)
  .then((data) => {
    const startTimestamp = moment(argv.date);
    const buy = argv.buy;
    const targets = argv.targets ? argv.targets.split(',') : [];
    let filledAt = null;
    let targetsFilled = [];
    const filtered = data.filter((element) => {
      const n = moment(element.T);
      return moment(element.T).isSame(startTimestamp) || moment(element.T).isAfter(startTimestamp)
    });
    let orderCanBeFilled = false;
    filtered.forEach((el) => {
      const open = BitcoinConverter.toSatoshis(el.O);
      const close = BitcoinConverter.toSatoshis(el.C);
      const high = BitcoinConverter.toSatoshis(el.H);
      const low = BitcoinConverter.toSatoshis(el.L);
      if (filledAt === null) {
        // find if order can be filled now;
        if (buy >= low && buy <= high) {
          filledAt = moment(el.T);
        }
      }
      // find targets
      let targetToCheck = targets[targetsFilled.length];
      if (targetToCheck >= low && targetToCheck <= high) {
        targetsFilled.push(moment(el.T));
      }
    });
    if (filledAt !== null) {
      console.log(`Order was filled on ${filledAt}`);
    }
    targetsFilled.forEach((target, index) => {
      console.log(`Target ${index + 1} filled at ${target}`);
    });
  })
  .catch((err) => {
    console.log('Error: ' + err.message);
  });