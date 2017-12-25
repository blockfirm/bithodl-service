const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

const config = require('./config');
const endpoints = require('./endpoints');
const wrapEndpoint = require('./wrapEndpoint');

function Service(options) {
  EventEmitter.call(this);
  this.node = options.node;
}

inherits(Service, EventEmitter);

Service.dependencies = ['bitcoind', 'web'];

Service.prototype.start = function (callback) {
  setImmediate(callback);
};

Service.prototype.stop = function (callback) {
  setImmediate(callback);
};

Service.prototype.getAPIMethods = function () {
  return [];
};

Service.prototype.getPublishEvents = function () {
  return [];
};

Service.prototype.setupRoutes = function (app) {
  app.get('/public-key/:publicKey/addresses', wrapEndpoint(endpoints.getAddresses, this));
  app.get('/address/:address/utxos', wrapEndpoint(endpoints.getUnspentOutputs, this));
  app.get('/fee/estimate', wrapEndpoint(endpoints.estimateFee, this));
  app.post('/transaction', wrapEndpoint(endpoints.postTransaction, this));
};

Service.prototype.getRoutePrefix = function () {
  return config.api.version;
};

module.exports = Service;
