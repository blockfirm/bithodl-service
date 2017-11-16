const assert = require('assert');
const sinon = require('sinon');
const getTransaction = require('../../src/bitcoin/getTransaction');

describe('bitcoin/getTransaction.js', () => {
  describe('getTransaction(node, txid)', () => {
    let fakeNode;
    let getDetailedTransactionSpy;

    beforeEach(() => {
      getDetailedTransactionSpy = sinon.spy();

      fakeNode = {
        services: {
          bitcoind: {
            getDetailedTransaction: getDetailedTransactionSpy
          }
        }
      };
    });

    it('accepts two arguments', () => {
      const actual = getTransaction.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a promise', () => {
      const returnValue = getTransaction(fakeNode, '');
      assert(returnValue instanceof Promise);
    });

    it('calls node.services.bitcoind.getDetailedTransaction(txid, callback) with txid once', () => {
      const fakeTxid = 'f6884395-95cd-4555-beff-21ceb5e87c58';

      getTransaction(fakeNode, fakeTxid);

      assert(getDetailedTransactionSpy.calledOnce);
      assert(getDetailedTransactionSpy.calledWith(fakeTxid));
    });

    describe('when node.services.bitcoind.getDetailedTransaction(txid, callback) callbacks an error', () => {
      it('rejects the promise', () => {
        const fakeError = new Error('57679845-42ab-4338-a4b9-10c0847f3277');

        fakeNode.services.bitcoind.getDetailedTransaction = sinon.spy((txid, callback) => {
          callback(fakeError);
        });

        const promise = getTransaction(fakeNode, '');

        return promise
          .then(() => {
            assert(false, 'Promise did not get rejected.');
          })
          .catch((error) => {
            assert.strictEqual(error, fakeError);
          });
      });
    });

    describe('when node.services.bitcoind.getDetailedTransaction(txid, callback) does not callbacks an error', () => {
      it('resolves the promise with the second callback argument', () => {
        const fakeArgument = '2de2e66f-5b4e-4894-8acb-5f2e1c3ccc8c';

        fakeNode.services.bitcoind.getDetailedTransaction = sinon.spy((txid, callback) => {
          callback(null, fakeArgument);
        });

        const promise = getTransaction(fakeNode, '');

        return promise.then((result) => {
          assert.equal(result, fakeArgument);
        });
      });
    });
  });
});
