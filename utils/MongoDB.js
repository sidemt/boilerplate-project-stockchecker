'use strict';

const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

exports.getLike =  function (symbol){
  return new Promise(function(resolve, reject) {
    MongoClient.connect(CONNECTION_STRING, function(err, client) {
      const db = client.db('stock-price');
      db.collection('likes').findOne( // Save to mongoDB
        { symbol: symbol }, function(err, doc) {
          if (err) {
            reject('MongoDB error');
          }
          console.log(doc);
          // console.log(doc.value.ips);
          if (doc) {
            resolve(doc.ips.length);
          } else {
            resolve(0);
          }
        }
      )
    })
  })
}

exports.postLike =  function (symbol, ip){
  return new Promise(function(resolve, reject) {
    MongoClient.connect(CONNECTION_STRING, function(err, client) {
      const db = client.db('stock-price');
      db.collection('likes').findOneAndUpdate( // Save to mongoDB
        { symbol: symbol },
        {
          $addToSet: {ips: ip}
        },
        {
          upsert: true,
          returnOriginal: false
        },
        function(err, doc) {
          if (err) {
            reject('MongoDB error');
          }
          // console.log(doc);
          // console.log(doc.value.ips);
          resolve(doc.value.ips.length);
        }
      )
    })
  })
}
