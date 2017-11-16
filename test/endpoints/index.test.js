const assert = require('assert');
const endpoints = require('../../src/endpoints');

describe('endpoints/index.js', () => {
  it('exports an object', () => {
    assert.equal(typeof endpoints, 'object');
  });

  describe('endpoints', () => {
    describe('#getAddresses', () => {
      it('is a function', () => {
        assert.equal(typeof endpoints.getAddresses, 'function');
      });
    });

    describe('#getUnspentOutputs', () => {
      it('is a function', () => {
        assert.equal(typeof endpoints.getUnspentOutputs, 'function');
      });
    });

    describe('#postTransaction', () => {
      it('is a function', () => {
        assert.equal(typeof endpoints.postTransaction, 'function');
      });
    });
  });
});
