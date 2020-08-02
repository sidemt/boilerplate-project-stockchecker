'use strict';

const https = require('https');

exports.callAPI =  function (symbol){
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

