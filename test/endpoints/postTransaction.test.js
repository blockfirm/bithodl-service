const assert = require('assert');
const sinon = require('sinon');

const HttpBadRequest = require('../../src/errors/HttpBadRequest');
const HttpInternalServerError = require('../../src/errors/HttpInternalServerError');
const postTransaction = require('../../src/endpoints/postTransaction');

describe('endpoints/postTransaction.js', () => {
  describe('postTransaction(request, response)', () => {
    let fakeTransaction;
    let fakeTxid;
    let fakeRequest;
    let fakeResponse;
    let sendTransactionSpy;
    let fakeNode;
    let thisArg;

    beforeEach(() => {
      fakeTransaction = '01000000017b1eabe0209b1fe794124575ef807057c77ada2138ae4fa8d6c4de0398a14f3f0000000000ffffffff01f0ca052a010000001976a914cbc20a7664f2f69e5355aa427045bc15e7c6c77288ac00000000';
      fakeTxid = '3af6ef78-99ce-4f35-bd29-3110517cc738';

      sendTransactionSpy = sinon.spy(function (transaction, callback) {
        callback(null, fakeTxid);
      });

      fakeRequest = {
        body: {
          transaction: fakeTransaction
        }
      };

      fakeResponse = {
        json: sinon.spy()
      };

      fakeNode = {
        services: {
          bitcoind: {
            sendTransaction: sendTransactionSpy
          }
        }
      };

      thisArg = {
        node: fakeNode
      };
    });

    it('accepts two arguments', () => {
      const actual = postTransaction.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a Promise', () => {
      const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);
      assert(returnedPromise instanceof Promise);
    });

    it('calls node.services.bitcoind.sendTransaction(transaction, callback) with request.body.transaction once', () => {
      const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(sendTransactionSpy.calledOnce);
        assert(sendTransactionSpy.calledWith(fakeRequest.body.transaction));
      });
    });

    it('calls response.json() with an object with txid', () => {
      const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

      return returnedPromise.then(() => {
        assert(fakeResponse.json.called);
        assert(fakeResponse.json.calledWithMatch({ txid: fakeTxid }));
      });
    });

    describe('when node.services.bitcoind.sendTransaction(transaction, callback) callbacks an error', () => {
      it('rejects the returned promise with HttpInternalServerError', () => {
        const fakeError = new Error('060bdb8b-8d68-4114-a93b-ed8e5f5a457e');

        fakeNode.services.bitcoind.sendTransaction = sinon.spy((transaction, callback) => {
          callback(fakeError);
        });

        const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpInternalServerError);
          });
      });
    });

    describe('when node.services.bitcoind.sendTransaction(transaction, callback) does not callbacks an error', () => {
      it('calls response.json() with the second callback argument as txid', () => {
        const fakeArgument = 'e3197e5c-f9dc-4166-808a-9f0fc457cb99';

        fakeNode.services.bitcoind.sendTransaction = sinon.spy((transaction, callback) => {
          callback(null, fakeArgument);
        });

        const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise.then(() => {
          assert(fakeResponse.json.calledOnce);
          assert(fakeResponse.json.calledWith({ txid: fakeArgument }));
        });
      });
    });

    describe('when request.body.transaction is an empty string', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.body.transaction = '';

        const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpBadRequest);
            assert(sendTransactionSpy.notCalled);
            assert(fakeResponse.json.notCalled);
          });
      });
    });

    describe('when request.body.transaction is undefined', () => {
      it('rejects the returned promise with HttpBadRequest', () => {
        fakeRequest.body.transaction = undefined;

        const returnedPromise = postTransaction.call(thisArg, fakeRequest, fakeResponse);

        return returnedPromise
          .then(() => {
            assert(false, 'Did not reject the returned promise');
          })
          .catch((error) => {
            assert(error instanceof HttpBadRequest);
            assert(sendTransactionSpy.notCalled);
            assert(fakeResponse.json.notCalled);
          });
      });
    });
  });
});
