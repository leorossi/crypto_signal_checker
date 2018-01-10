# Crypto Trading Dashboard

## Introduction
This collection of tools will help me and my friends to have a better trading experience, visualizing data in a better way and operate more quickly on crypto markets.

## Usage
You should have Node v6.x installed in your machine.

Install dependencies with
```
npm install
```

## CLI Tools

### Signal Checker
The purpose of this tool is to check crypto "signals" provided by your fellow source of trading signals and check wether the buy price has been met after the signal, and if targets where reached as well.

To evaluate your source, it's important that the buy zone is ready after the signal is provided. Some free channels sends signal too late and the buy zone has been already passed.

It will take data from Bittrex public API, please do not overuse that otherwise your IP may be banned ;)

#### Run checker

```
node cli/signal_tester.js --coin COIN_NAME --buy BUY_PRICE --targets=TARGET1,TARGET2,TARGET3 --date=2018-01-01T03:55`
```

* `COIN_NAME` is the ticker name 
* `BUY_PRICE` and `TARGET1` etc.. are in Satoshis (1/100.000.000 of BTC)

### Bittrex Tools 

#### Configure

Proivde a `.env` files in the project root directory with your keys in this format

```
BITTREX_API_KEY=xxxxxxxxx
BITTREX_API_SECRET=xxxxxxxxx
```

#### Get total deposits
Whill show you how much money you have deposited on Bittrex so far. It will take all your deposits and convert to USD (at the date's rate).

```
node cli/bittrex_total_deposits.js
```

#### Open Orders Status

Prints a table with info on your open orders. It shows also the price delta between your target price and current market price.

```
node cli/bittrex_open_order_status.js
```

#### Closed position report

Prints a report of your closed positions, with your gain in value, percent, totals etc...

```
node cli/bittrex_closed_positions.js
```