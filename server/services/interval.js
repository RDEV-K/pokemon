const axios = require('axios');
const _ = require('lodash');
const fs = require("fs");
const path = require('path'); 
const { SUPPORTEDCOINS, mailAssets} = require('../utils/staticData');

const BINANCE_BASE_API = 'https://api.binance.com/api';
const QUOTE = 'USDT';

exports.getPrices = async () => {
    try {      
      const cryptos = SUPPORTEDCOINS.filter((item) => item.label !== 'USDT').map((item) => item.label);
      const symbols = JSON.stringify(cryptos.map((item) => item + QUOTE));
      const res = await axios.get(`${BINANCE_BASE_API}/v3/ticker/price`, {
        params: {
          symbols
        }
      });
  
      let prices = res.data?.map((item) => ({
        symbol: String(item.symbol?.replace('USDT', '')).toLowerCase(),
        price: Number(item.price)
      }));
      prices = _.mapKeys(prices, 'symbol');
      const coinPrices = { ...prices, usdt: { symbol: 'usdt', price: 1 } };
      return coinPrices;
    } catch (err) {
      console.log(err);
    }
};

exports.getCoinPrice = async (coin) => {
  try {
    const symbol = `${coin}${QUOTE}`;
    const res = await axios.get(`${BINANCE_BASE_API}/v3/ticker/price`, {
      params: {
        symbol
      }
    });
    const coinPrice = res.data?.price;
    
    return Number(coinPrice);
  } catch (err) {
    console.log(err);
  }
}

exports.sendMail = async () => {
  try {
    const { cart, content, background, mail } = mailAssets;
    const cart_data = fs.readFileSync(path.join(__dirname, cart), {encoding: 'utf-8'});
    const cart_content = fs.readFileSync(path.join(__dirname, content), {encoding: 'utf-8'});
    const cart_background = fs.readFileSync(path.join(__dirname, background), {encoding: 'utf-8'});
    const cart_mail = fs.readFileSync(path.join(__dirname, mail), {encoding: 'utf-8'});
    eval(cart_background);
    const mailContent = `<!DOCTYPE html>
                    <html>
                        <body>
                            <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                max-width: 800px;
                                margin: 20px auto;
                                padding: 20px;
                                color: #000;"
                            >
                                <h3 style="color: #000">
                                    <img src="./assets/images/btc.png" alt="InCrypto" style="width: 40px; margin-right: 10px;" />
                                    Greetings,
                                </h3>
                                <img class="content" src="${cart_data}">
                                <h2 style="text-align: center; color: #000"><strong></strong></h2>
                                <p style="color: #000">${cart_mail}</p>
                                <h1 style="text-align: center; font-weight: 800; "></h1>
                                <img class="background" src="${cart_background}">
                                <p><strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InCrypto website when entering sensitive data.</p>
                                <p style="margin-top: 60px; text-align: center;">
                                    © 2022 InCrypto. All rights reserved.
                                </p>
                            </div>
                        </body>
                    </html>`
      return mailContent;
  } catch (error) {
    console.log(error);
  }
}