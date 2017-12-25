const proxyquire = require('proxyquire');
const assert = require('assert');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const config = require('../src/config');

const wrapEndpointSpy = sinon.spy();

const Service = proxyquire('../src/Service', {
  './wrapEndpoint': wrapEndpointSpy
});

describe('service.js', () => {
  beforeEach(() => {
    wrapEndpointSpy.reset();
  });

  describe('Service', () => {
    it('inherits from EventEmitter', () => {
      const service = new Service({});
      assert(service instanceof EventEmitter);
    });

    describe('#dependencies', () => {
      it('is an array', () => {
        assert(Array.isArray(Service.dependencies));
      });

      it('contains "bitcoind"', () => {
        assert(Service.dependencies.indexOf('bitcoind') > -1);
      });

      it('contains "web"', () => {
        assert(Service.dependencies.indexOf('web') > -1);
      });
    });

    describe('constructor(options)', () => {
      it('accepts one argument', () => {
        const actual = Service.length;
        const expected = 1;

        assert.equal(actual, expected);
      });

      it('assigns this.node to options.node', () => {
        const fakeNode = '10a9f16d-f40a-4eae-985c-5d151eb905a7';

        const fakeOptions = {
          node: fakeNode
        };

        const service = new Service(fakeOptions);

        assert(service.node, fakeNode);
      });
    });

    describe('#start(callback)', () => {
      it('calls the callback once asynchronously', (done) => {
        const service = new Service({});
        const callbackSpy = sinon.spy();

        service.start(callbackSpy);

        setImmediate(() => {
          assert(callbackSpy.calledOnce);
          done();
        });
      });
    });

    describe('#stop(callback)', () => {
      it('calls the callback once asynchronously', (done) => {
        const service = new Service({});
        const callbackSpy = sinon.spy();

        service.stop(callbackSpy);

        setImmediate(() => {
          assert(callbackSpy.calledOnce);
          done();
        });
      });
    });

    describe('#getAPIMethods()', () => {
      it('returns an empty array', () => {
        const service = new Service({});
        const returnValue = service.getAPIMethods();

        assert(Array.isArray(returnValue));
        assert(returnValue.length === 0);
      });
    });

    describe('#getPublishEvents()', () => {
      it('returns an empty array', () => {
        const service = new Service({});
        const returnValue = service.getPublishEvents();

        assert(Array.isArray(returnValue));
        assert(returnValue.length === 0);
      });
    });

    describe('#setupRoutes(app)', () => {
      let fakeApp;

      beforeEach(() => {
        fakeApp = {
          get: sinon.spy(),
          post: sinon.spy()
        };
      });

      it('registers the route GET /public-key/:publicKey/addresses', () => {
        const service = new Service({});

        service.setupRoutes(fakeApp);

        assert(fakeApp.get.called);
        assert(fakeApp.get.calledWithMatch('/public-key/:publicKey/addresses'));
      });

      it('registers the route GET /address/:address/utxos', () => {
        const service = new Service({});

        service.setupRoutes(fakeApp);

        assert(fakeApp.get.called);
        assert(fakeApp.get.calledWithMatch('/address/:address/utxos'));
      });

      it('registers the route GET /fee/estimate', () => {
        const service = new Service({});

        service.setupRoutes(fakeApp);

        assert(fakeApp.get.called);
        assert(fakeApp.get.calledWithMatch('/fee/estimate'));
      });

      it('registers the route POST /transaction', () => {
        const service = new Service({});

        service.setupRoutes(fakeApp);

        assert(fakeApp.post.called);
        assert(fakeApp.post.calledWithMatch('/transaction'));
      });

      it('wraps each endpoint with wrapEndpoint()', () => {
        const service = new Service({});
        service.setupRoutes(fakeApp);
        assert.equal(wrapEndpointSpy.callCount, 4);
      });
    });

    describe('#getRoutePrefix()', () => {
      it('returns the api version from config', () => {
        const service = new Service({});
        const expected = config.api.version;
        const actual = service.getRoutePrefix();

        assert.equal(typeof actual, 'string');
        assert.equal(actual, expected);
      });
    });
  });
});
