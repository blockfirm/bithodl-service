const proxyquire = require('proxyquire');
const assert = require('assert');
const sinon = require('sinon');
const HttpBadRequest = require('../../src/errors/HttpBadRequest');
const HttpInternalServerError = require('../../src/errors/HttpInternalServerError');

const fakeAddress = { hash: '2NBXAG4mMbYu2GVjxHxgUE6cLevdptqbHbv' };

const fakeUtxo = {
  txid: 'f7b99699-0560-44fa-8866-79465568f655',
  address: fakeAddress.hash
};

const getPossibleAddressesSpy = sinon.spy(function () {
  return [fakeAddress];
});

let getAddressUnspentOutputsReturn;

const getAddressUnspentOutputsSpy = sinon.spy(function () {
  return getAddressUnspentOutputsReturn;
});

const getAddresses = proxyquire('../../src/endpoints/getAddresses', {
  '../bitcoin/getPossibleAddresses': getPossibleAddressesSpy,
  '../bitcoin/getAddressUnspentOutputs': getAddressUnspentOutputsSpy
});

describe('endpoints/getAddresses.js', () => {
  describe('getAddresses(request, response)', () => {
    let fakePublicKey;
    let fakeRequest;
    let fakeResponse;
    let getDetailedTransactionSpy;
    let fakeNode;
    let thisArg;

    beforeEach(() => {
      getPossibleAddressesSpy.reset();

      getAddressUnspentOutputsReturn = Promise.resolve([fakeUtxo]);
      fakePublicKey = '03fad62848f1a6cde4c4d9453dadea714cbd59f1282087853de8b0c6072bec27e7';

      getDetailedTransactionSpy = sinon.spy(function (txid, callback) {
        callback(null, { blockTimestamp: 0 });
      });

      fakeRequest = {
        params: {
          publicKey: fakePublicKey
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
      const actual = getAddresses.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a Promise', () => {
      const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);
      assert(returnedPromise instanceof Promise);
    });

    it('calls getPossibleAddresses(publicKey) with the public key', () => {
      const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(getPossibleAddressesSpy.calledOnce);
        const firstArgument = getPossibleAddressesSpy.getCall(0).args[0];
        assert.equal(firstArgument.toString(), fakePublicKey);
      });
    });

    it('calls response.json() with an array', () => {
      const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(fakeResponse.json.called);
        assert(Array.isArray(fakeResponse.json.getCall(0).args[0]));
      });
    });

    describe('when getAddressUnspentOutputs() returns a rejected promise', () => {
      it('rejects the returned promise with HttpInternalServerError', () => {
        const fakeError = new Error('70bcf998-49d7-443a-800b-065f995f56ba');
        getAddressUnspentOutputsReturn = Promise.reject(fakeError);
        const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpInternalServerError);
          });
      });
    });

    describe('when request.params.publicKey is an empty string', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.publicKey = '';

        const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

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

    describe('when request.params.publicKey is undefined', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.publicKey = undefined;

        const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

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

    describe('when request.params.publicKey is an invalid public key', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.params.publicKey = 'invalidpublickey';

        const returnedPromise = getAddresses.call(thisArg, fakeRequest, fakeResponse);

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
