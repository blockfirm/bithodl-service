const assert = require('assert');
const sinon = require('sinon');

const HttpInternalServerError = require('../../src/errors/HttpInternalServerError');
const estimateFee = require('../../src/endpoints/estimateFee');

describe('endpoints/estimateFee.js', () => {
  describe('estimateFee(request, response)', () => {
    let fakeFee;
    let fakeRequest;
    let fakeResponse;
    let estimateFeeSpy;
    let fakeNode;
    let thisArg;

    beforeEach(() => {
      fakeFee = 0.00089;

      estimateFeeSpy = sinon.spy(function (numberOfBlocks, callback) {
        callback(null, fakeFee);
      });

      fakeRequest = {
        body: {}
      };

      fakeResponse = {
        json: sinon.spy()
      };

      fakeNode = {
        services: {
          bitcoind: {
            estimateFee: estimateFeeSpy
          }
        }
      };

      thisArg = {
        node: fakeNode
      };
    });

    it('accepts two arguments', () => {
      const actual = estimateFee.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a Promise', () => {
      const returnedPromise = estimateFee.call(thisArg, fakeRequest, fakeResponse);
      assert(returnedPromise instanceof Promise);
    });

    it('calls node.services.bitcoind.estimateFee(numberOfBlocks, callback) once with 3 as numberOfBlocks', () => {
      const returnedPromise = estimateFee.call(thisArg, fakeRequest, fakeResponse);
      const expectedNumberOfBlocks = 3;

      return returnedPromise.then(() => {
        assert(estimateFeeSpy.calledOnce);
        assert(estimateFeeSpy.calledWith(expectedNumberOfBlocks));
      });
    });

    it('calls response.json() with an object with the fee', () => {
      const returnedPromise = estimateFee.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(fakeResponse.json.called);
        assert(fakeResponse.json.calledWithMatch({ feesPerKilobyte: fakeFee }));
      });
    });

    describe('when node.services.bitcoind.estimateFee(numberOfBlocks, callback) callbacks an error', () => {
      it('rejects the returned promise with HttpInternalServerError', () => {
        const fakeError = new Error('d9ac8d87-fe4d-4d99-8a0b-1d564233e36f');

        fakeNode.services.bitcoind.estimateFee = sinon.spy((numberOfBlocks, callback) => {
          callback(fakeError);
        });

        const returnedPromise = estimateFee.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpInternalServerError);
          });
      });
    });

    describe('when node.services.bitcoind.estimateFee(numberOfBlocks, callback) does not callbacks an error', () => {
      it('calls response.json() with the second callback argument as feesPerKilobyte', () => {
        const fakeArgument = 'bfc1fab4-c649-476d-9627-9fca6c6fcb34';

        fakeNode.services.bitcoind.estimateFee = sinon.spy((numberOfBlocks, callback) => {
          callback(null, fakeArgument);
        });

        const returnedPromise = estimateFee.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise.then(() => {
          assert(fakeResponse.json.calledOnce);
          assert(fakeResponse.json.calledWith({ feesPerKilobyte: fakeArgument }));
        });
      });
    });
  });
});
