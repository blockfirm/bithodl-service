const proxyquire = require('proxyquire');
const assert = require('assert');
const sinon = require('sinon');
const HttpBadRequest = require('../../src/errors/HttpBadRequest');
const HttpInternalServerError = require('../../src/errors/HttpInternalServerError');

let getAddressUnspentOutputsReturn;

const getAddressUnspentOutputsSpy = sinon.spy(function () {
  return getAddressUnspentOutputsReturn;
});

const getUnspentOutputs = proxyquire('../../src/endpoints/getUnspentOutputs', {
  '../bitcoin/getAddressUnspentOutputs': getAddressUnspentOutputsSpy
});

describe('endpoints/getUnspentOutputs.js', () => {
  describe('getUnspentOutputs(request, response)', () => {
    let fakeAddress;
    let fakeRequest;
    let fakeResponse;
    let getDetailedTransactionSpy;
    let fakeNode;
    let thisArg;

    beforeEach(() => {
      getAddressUnspentOutputsSpy.reset();

      getAddressUnspentOutputsReturn = Promise.resolve([
        { txid: 'f0f31b49-3b77-4e6c-a162-9f133deb7ca0' }
      ]);

      fakeAddress = '2NBXAG4mMbYu2GVjxHxgUE6cLevdptqbHbv';

      getDetailedTransactionSpy = sinon.spy(function (txid, callback) {
        callback(null, { blockTimestamp: 0 });
      });

      fakeRequest = {
        params: {
          address: fakeAddress
        }
      };

      fakeResponse = {
        json: sinon.spy()
      };

      fakeNode = {
        services: {
          bitcoind: {
            getDetailedTransaction: getDetailedTransactionSpy
          }
        }
      };

      thisArg = {
        node: fakeNode
      };
    });

    it('accepts two arguments', () => {
      const actual = getUnspentOutputs.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a Promise', () => {
      const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);
      assert(returnedPromise instanceof Promise);
    });

    it('calls getAddressUnspentOutputs(node, address) with the address', () => {
      const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(getAddressUnspentOutputsSpy.calledOnce);
        assert.equal(getAddressUnspentOutputsSpy.getCall(0).args[1], fakeAddress);
      });
    });

    it('calls response.json() with an array', () => {
      const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(fakeResponse.json.called);
        assert(Array.isArray(fakeResponse.json.getCall(0).args[0]));
      });
    });

    describe('when getAddressUnspentOutputs() returns a rejected promise', () => {
      it('rejects the returned promise with HttpInternalServerError', () => {
        const fakeError = new Error('a1af9d2c-c294-4957-af4a-4eb6f2dc77dd');
        getAddressUnspentOutputsReturn = Promise.reject(fakeError);
        const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpInternalServerError);
          });
      });
    });

    describe('when request.params.address is an empty string', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.address = '';

        const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpBadRequest);
            assert(fakeResponse.json.notCalled);
          });
      });
    });

    describe('when request.params.address is undefined', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.address = undefined;

        const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpBadRequest);
            assert(fakeResponse.json.notCalled);
          });
      });
    });

    describe('when request.params.address is an invalid address', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.address = 'invalidaddress';

        const returnedPromise = getUnspentOutputs.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpBadRequest);
            assert(fakeResponse.json.notCalled);
          });
      });
    });
  });
});
