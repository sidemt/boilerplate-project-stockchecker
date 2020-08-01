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
      const options = {
        "method": "GET",
        "hostname": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "port": null,
        "path": "/stock/v2/get-profile?symbol=GOOG",
        "headers": {
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "useQueryString": true
        }
      };

      const api_req = https.request(options, (api_res) => {
        let data = '';
        // A chunk of data has been recieved.
        api_res.on('data', (d) => {
          data += d;
        });
        // The whole response has been received. Print out the result.
        api_res.on('end', () => {
          res.json(JSON.parse(data));
        })
      }).on('error', (e) => {
        res.json('{"Error": "Error on accessing external API."}');
      })
      api_req.end();

    });

};
