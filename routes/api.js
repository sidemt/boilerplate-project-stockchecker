/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const https = require('https');

const RapidApi = require('../utils/RapidAPI');
const MongoDB = require('../utils/MongoDB');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log(req.query.stock);
      let symbol = req.query.stock;
      console.log('type', typeof symbol);
      if (typeof symbol === 'string') {
        symbol = symbol.toUpperCase();
        Promise.all([
          RapidApi.callAPI(symbol),
          req.query.like ? MongoDB.postLike(symbol, '2.2.2.3') : MongoDB.getLike(symbol)
        ]).then((values) => {
          let result = {
            "stockData": {
              "stock": `${symbol}`,
              "price": values[0],
              "likes": values[1]
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
        symbol = symbol.map(function(elem){
          if (typeof elem === 'string'){
            return elem.toUpperCase();
          } else {
            return 'ERROR'
          }
        })

        Promise.all([
          RapidApi.callAPI(symbol[0]),
          req.query.like ? MongoDB.postLike(symbol[0], '2.2.2.3') : MongoDB.getLike(symbol[0]),
          RapidApi.callAPI(symbol[1]),
          req.query.like ? MongoDB.postLike(symbol[1], '2.2.2.3') : MongoDB.getLike(symbol[1])
        ]).then((values) => {
          console.log('values: ', values);
          let result = {
            "stockData": [
              {
                "stock": `${symbol[0]}`,
                "price": values[0],
                "likes": values[1] - values[3]
              },
              {
                "stock": `${symbol[1]}`,
                "price": values[2],
                "likes": values[3] - values[1]
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






    });

};
