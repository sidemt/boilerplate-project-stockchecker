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
        hostname: 'repeated-alpaca.glitch.me',
        path: '/v1/stock/GOOG/quote',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }

      const https_req = https.request(options, (res2) => {
        let data = '';
        // A chunk of data has been recieved.
        res2.on('data', (d) => {
          data += d;
        });
        // The whole response has been received. Print out the result.
        res2.on('end', () => {
          console.log(data);
          res.json(data);
        })
      }).on('error', (e) => {
        res.send('Error on accessing external API.');
      })
      https_req.end();

    });

};
