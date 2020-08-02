/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
// var MongoClient = require('mongodb');
const https = require('https');

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log(req.query.stock);
      const symbol = req.query.stock;
      console.log('type', typeof symbol);
      if (typeof symbol === 'string') {
        // yahoo finance API accepts lower or upper case
        callAPI(symbol).then((price) => {
          let result = {
            "stockData": {
              "stock": `${symbol}`,
              "price": price,
              "likes":1
            }
          }
          res.json(result);
        }, (error) => {
          console.log(error);
          let result = {
            "stockData": {
              "error": "expternal source error",
              "likes":1
            }
          }
          res.json(result);
        });

      } else if (Array.isArray(symbol) && symbol.length === 2) {
        Promise.all([ callAPI(symbol[0]), callAPI(symbol[1]) ]).then((values) => {
          console.log('values: ', values);
          let result = {
            "stockData": [
              {
                "stock": `${symbol[0]}`,
                "price": values[0],
                "likes": -1
              },
              {
                "stock": `${symbol[1]}`,
                "price": values[1],
                "likes": 1
              },
            ]
          }
          res.json(result);
        }, (error) => {
          console.log(error);
          let result = {
            "stockData": [
              {
                "error": "expternal source error",
                "likes": -1
              },
              {
                "error": "expternal source error",
                "likes": 1
              },
            ]
          }
          res.json(result);
        });

      } else {
        return res.json('{"Error": "Invalid stock param."}');
      }



      function callAPI(symbol){
        const options = {
          "method": "GET",
          "hostname": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          "port": null,
          "path": `/stock/v2/get-profile?symbol=${symbol}`,
          "headers": {
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "useQueryString": true
          }
        };

        return new Promise(function (resolve, reject) {
          const api_req = https.request(options, (api_res) => {
            let data = '';
            // A chunk of data has been recieved.
            api_res.on('data', (d) => {
              data += d;
            });
            // The whole response has been received. Print out the result.
            api_res.on('end', () => {
              let parsed = JSON.parse(data);
              // Return the price in string format
              resolve(parsed.price.regularMarketPrice.raw.toString());
            })
          }).on('error', (e) => {
            reject(e);
          })
          api_req.end();
        })

      }


    });

};
