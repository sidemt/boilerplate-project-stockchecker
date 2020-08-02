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
      console.log('req:', req.headers);
      var x_forwarded_for_full = req.headers['x-forwarded-for'];
      if (typeof x_forwarded_for_full === 'undefined') {
        // the ['x-forwarded-for'] header does not exist in local environment
        var ipaddress = '127.0.0.0';
      } else {
        var ipaddress = x_forwarded_for_full.slice(0, x_forwarded_for_full.indexOf(','));
      }
      console.log('IP:', ipaddress);

      console.log(req.query.stock);
      let symbol = req.query.stock;
      console.log('type', typeof symbol);
      if (typeof symbol === 'string') {
        symbol = symbol.toUpperCase();
        Promise.all([
          RapidApi.callAPI(symbol),
          req.query.like ? MongoDB.postLike(symbol, ipaddress) : MongoDB.getLike(symbol)
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
              "likes": 0
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
          req.query.like ? MongoDB.postLike(symbol[0], ipaddress) : MongoDB.getLike(symbol[0]),
          RapidApi.callAPI(symbol[1]),
          req.query.like ? MongoDB.postLike(symbol[1], ipaddress) : MongoDB.getLike(symbol[1])
        ]).then((values) => {
          console.log('values: ', values);
          let result = {
            "stockData": [
              {
                "stock": `${symbol[0]}`,
                "price": values[0],
                "rel_likes": values[1] - values[3]
              },
              {
                "stock": `${symbol[1]}`,
                "price": values[2],
                "rel_likes": values[3] - values[1]
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
                "rel_likes": 0
              },
              {
                "error": "expternal source error",
                "rel_likes": 0
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
