# Crypto Signal Checker

## Introduction

The purpose of this tool is to check crypto "signals" provided by your fellow source of trading signals and check wether the buy price has been met after the signal, and if targets where reached as well.

To evaluate your source, it's important that the buy zone is ready after the signal is provided. Some free channels sends signal too late and the buy zone has been already passed.

It will take data from Bittrex public API, please do not overuse that otherwise your IP may be banned ;)
## Usage
You should have Node v6.x installed in your machine.

### Install dependencies

```
npm install
```

### Run checker

```
node signal_tester.js --coin COIN_NAME --buy BUY_PRICE --targets=TARGET1,TARGET2,TARGET3 --date=2018-01-01T03:55`
```

* `COIN_NAME` is the ticker name 
* `BUY_PRICE` and `TARGET1` etc.. are in Satoshis (1/100.000.000 of BTC)
