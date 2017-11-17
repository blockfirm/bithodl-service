const proxyquire = require('proxyquire');
const assert = require('assert');
const sinon = require('sinon');
const bitcore = require('bitcore-lib');

const fakeConfig = {
  scan: {
    startDate: '10 September, 2017, 00:00 GMT+02:00',
    lookaheadYears: 1
  }
};

const getPossibleAddresses = proxyquire('../../src/bitcoin/getPossibleAddresses', {
  '../config': fakeConfig
});

describe('bitcoin/getPossibleAddresses.js', () => {
  describe('getPossibleAddresses(publicKey)', () => {
    let privateKey;
    let publicKey;

    beforeEach(() => {
      privateKey = new bitcore.PrivateKey('b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79');
      publicKey = privateKey.toPublicKey();
    });

    it('accepts one argument', () => {
      const actual = getPossibleAddresses.length;
      const expected = 1;

      assert.equal(actual, expected);
    });

    describe('when today is 25 Oct, 2017', () => {
      let clock;

      before(() => {
        const today = new Date('25 October, 2017, 00:00 GMT+02:00');
        clock = sinon.useFakeTimers(today.getTime());
      });

      after(() => {
        clock.restore();
      });

      describe('when startDate is 10 Sep, 2017 and lookaheadYears is 1 year', () => {
        let returnValue;

        before(function () {
          this.timeout(60 * 1000); // Increase timeout to 60 seconds.
          returnValue = getPossibleAddresses(publicKey);
        });

        it('returns an array', () => {
          assert(Array.isArray(returnValue));
        });

        it('returns one address for each hour in that period', () => {
          assert.equal(returnValue.length, 9839);
          assert.equal(typeof returnValue[0], 'object');
          assert.equal(returnValue[0].hash, '2NBXAG4mMbYu2GVjxHxgUE6cLevdptqbHbv');
        });
      });
    });
  });
});
