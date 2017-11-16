const assert = require('assert');
const sinon = require('sinon');
const getAddressUnspentOutputs = require('../../src/bitcoin/getAddressUnspentOutputs');

describe('bitcoin/getAddressUnspentOutputs.js', () => {
  describe('getAddressUnspentOutputs(node, addresses)', () => {
    let fakeNode;

    beforeEach(() => {
      fakeNode = {
        getAddressUnspentOutputs: sinon.spy()
      };
    });

    it('accepts two arguments', () => {
      const actual = getAddressUnspentOutputs.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns a promise', () => {
      const returnValue = getAddressUnspentOutputs(fakeNode, []);
      assert(returnValue instanceof Promise);
    });

    it('calls node.getAddressUnspentOutputs(addresses, options, callback) with addresses once', () => {
      const fakeAddresses = [
        '69a93600-e5bd-4cd0-86ef-3b23f849047b'
      ];

      getAddressUnspentOutputs(fakeNode, fakeAddresses);

      assert(fakeNode.getAddressUnspentOutputs.calledOnce);
      assert(fakeNode.getAddressUnspentOutputs.calledWith(fakeAddresses));
    });

    describe('when node.getAddressUnspentOutputs(addresses, options, callback) callbacks an error', () => {
      it('rejects the promise', () => {
        const fakeError = new Error('83e87017-42af-4d9f-879e-1b49919095ad');

        fakeNode.getAddressUnspentOutputs = sinon.spy((addresses, options, callback) => {
          callback(fakeError);
        });

        const promise = getAddressUnspentOutputs(fakeNode, []);

        return promise
          .then(() => {
            assert(false, 'Promise did not get rejected.');
          })
          .catch((error) => {
            assert.strictEqual(error, fakeError);
          });
      });
    });

    describe('when node.getAddressUnspentOutputs(addresses, options, callback) does not callbacks an error', () => {
      it('resolves the promise with the second callback argument', () => {
        const fakeArgument = '4a6a6813-c730-43ca-82f4-aec3984922fb';

        fakeNode.getAddressUnspentOutputs = sinon.spy((addresses, options, callback) => {
          callback(null, fakeArgument);
        });

        const promise = getAddressUnspentOutputs(fakeNode, []);

        return promise.then((result) => {
          assert.equal(result, fakeArgument);
        });
      });
    });
  });
});
