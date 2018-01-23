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
        it('equals "livenet"', () => {
          assert.equal(typeof config.bitcoin.network, 'string');
          assert.equal(config.bitcoin.network, 'livenet');
        });
      });

      describe('.fee', () => {
        it('is an object', () => {
          assert.equal(typeof config.bitcoin.fee, 'object');
        });

        describe('.numberOfBlocks', () => {
          it('equals 3', () => {
            assert.equal(typeof config.bitcoin.fee.numberOfBlocks, 'number');
            assert.equal(config.bitcoin.fee.numberOfBlocks, 3);
          });
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
        it('equals 21 January, 2018 when evaluated as a date', () => {
          const startDate = new Date(config.scan.startDate);

          assert.equal(startDate.getDate(), 21);
          assert.equal(startDate.getMonth(), 0);
          assert.equal(startDate.getFullYear(), 2018);
        });
      });

      describe('.lookaheadYears', () => {
        it('equals 4', () => {
          assert.strictEqual(config.scan.lookaheadYears, 4);
        });
      });
    });
  });
});
