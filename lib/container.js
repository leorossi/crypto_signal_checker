'use strict';
const awilix = require('awilix');
const { asClass, asFunction, asValue} = awilix;
// Create container
const container = awilix.createContainer();

const bitcoin_converter = require('./bitcoin_converter');
const bittrex_data_retriever = require('./bittrex_data_retriever');

container.register('BitcoinConverter', asClass(bitcoin_converter));
container.register('BittrexDataRetriever', asClass(bittrex_data_retriever));

module.exports = container;
