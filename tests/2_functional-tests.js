/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
const timeout = 5000;

var likes;

suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {

      test('1 stock', function(done) {
      this.timeout(timeout);
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){

          //complete this one too
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'GOOG', 'should return symbol name');
          assert.typeOf(res.body.stockData.price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData.likes, 'number', 'should return number of likes as a number');
          done();
        });
      });

      test('1 stock with like', function(done) {
        this.timeout(timeout);
        chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'goog',
          like: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'GOOG', 'should return symbol name');
          assert.typeOf(res.body.stockData.price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData.likes, 'number', 'should return number of likes as a number');
          likes = res.body.stockData.likes;
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(timeout);
        chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'goog',
          like: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'GOOG', 'should return symbol name');
          assert.typeOf(res.body.stockData.price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData.likes, 'number', 'should return number of likes as a number');
          assert.equal(res.body.stockData.likes, likes, 'number of likes should not be changed');
          done();
        });
      });

      test('2 stocks', function(done) {
        this.timeout(timeout);
        chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: ['goog', 'msft']
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'stockData should be an array');
          assert.equal(res.body.stockData[0].stock, 'GOOG', 'should return symbol name');
          assert.typeOf(res.body.stockData[0].price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData[0].rel_likes, 'number', 'should return number of likes as a number');
          assert.equal(res.body.stockData[1].stock, 'MSFT', 'should return symbol name');
          assert.typeOf(res.body.stockData[1].price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData[1].rel_likes, 'number', 'should return number of likes as a number');
          assert.equal(0, res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 'sum of rel_likes should be 0');
          done();
        });
      });

      test('2 stocks with like', function(done) {
        this.timeout(timeout);
        chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: ['goog', 'msft'],
          like: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'stockData should be an array');
          assert.equal(res.body.stockData[0].stock, 'GOOG', 'should return symbol name');
          assert.typeOf(res.body.stockData[0].price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData[0].rel_likes, 'number', 'should return number of likes as a number');
          assert.equal(res.body.stockData[1].stock, 'MSFT', 'should return symbol name');
          assert.typeOf(res.body.stockData[1].price, 'string', 'should return price as a string');
          assert.typeOf(res.body.stockData[1].rel_likes, 'number', 'should return number of likes as a number');
          assert.equal(0, res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 'sum of rel_likes should be 0');
          done();
        });
      });

    });

});
