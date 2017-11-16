const assert = require('assert');
const config = require('../src/config');

describe('config.js', () => {
  it('exports an object', () => {
    assert.equal(typeof config, 'object');
  });

  describe('config', () => {
    describe('.bitcoin', () => {
      it('is an object', () => {
        assert.equal(typeof config.bitcoin, 'object');
      });

      describe('.network', () => {
        it('equals "testnet"', () => {
          assert.equal(typeof config.bitcoin.network, 'string');
          assert.equal(config.bitcoin.network, 'testnet');
        });
      });
    });

    describe('.api', () => {
      it('is an object', () => {
        assert.equal(typeof config.api, 'object');
      });

      describe('.version', () => {
        it('equals "v1"', () => {
          assert.equal(typeof config.api.version, 'string');
          assert.equal(config.api.version, 'v1');
        });
      });
    });

    describe('.scan', () => {
      it('is an object', () => {
        assert.equal(typeof config.scan, 'object');
      });

      describe('.startDate', () => {
        it('equals 10 September, 2017 when evaluated as a date', () => {
          const startDate = new Date(config.scan.startDate);

          assert.equal(startDate.getDate(), 10);
          assert.equal(startDate.getMonth(), 8);
          assert.equal(startDate.getFullYear(), 2017);
        });
      });

      describe('.lookaheadYears', () => {
        it('equals 10', () => {
          assert.strictEqual(config.scan.lookaheadYears, 10);
        });
      });
    });
  });
});
