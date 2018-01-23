const proxyquire = require('proxyquire');
const assert = require('assert');
const bitcore = require('bitcore-lib');

const createLockedAddress = proxyquire('../../src/bitcoin/createLockedAddress', {
  '../config': require('../configMock')
});

describe('bitcoin/createLockedAddress.js', () => {
  describe('createLockedAddress(publicKey, unlockDate)', () => {
    let privateKey;
    let publicKey;

    beforeEach(() => {
      privateKey = new bitcore.PrivateKey('b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79');
      publicKey = privateKey.toPublicKey();
    });

    it('accepts two arguments', () => {
      const actual = createLockedAddress.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('does not modify the input arguments', () => {
      const unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
      const expectedPublicKey = publicKey.toString();
      const expectedUnlockDate = unlockDate.toString();

      createLockedAddress(publicKey, unlockDate);

      const actualPublicKey = publicKey.toString();
      const actualUnlockDate = unlockDate.toString();

      assert.equal(actualPublicKey, expectedPublicKey);
      assert.equal(actualUnlockDate, expectedUnlockDate);
    });

    it('returns an object', () => {
      const unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
      const address = createLockedAddress(publicKey, unlockDate);

      assert.equal(typeof address, 'object');
    });

    describe('the return object', () => {
      let unlockDate;
      let returnObject;

      beforeEach(() => {
        unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
        returnObject = createLockedAddress(publicKey, unlockDate);
      });

      it('has "script" set to the redeem script', () => {
        assert.equal(returnObject.script, '4 0xe0b7ef59 OP_NOP2 OP_DROP OP_DUP OP_HASH160 20 0xf9c1437adefc936cea1e20109a5c56ad51a13de6 OP_EQUALVERIFY OP_CHECKSIG');
      });

      it('has "hash" set to the address hash', () => {
        assert.equal(returnObject.hash, '2N6oSTcdmjmTPEQ1sLTBye8HCvbM2fyL2HM');
      });

      it('has "unlockTimestamp" set to the unix timestamp of the unlock date', () => {
        assert.equal(returnObject.unlockTimestamp, unlockDate.getTime() / 1000);
      });
    });

    describe('when unlockDate is not a full hour', () => {
      let unlockDate;
      let returnObject;

      beforeEach(() => {
        unlockDate = new Date('25 October, 2017, 01:20 GMT+02:00');
        returnObject = createLockedAddress(publicKey, unlockDate);
      });

      it('enforces the lock date to full hours', () => {
        const expectedUnlockDate = new Date('25 October, 2017, 01:00 GMT+02:00');

        assert.equal(returnObject.unlockTimestamp, expectedUnlockDate.getTime() / 1000);
        assert.equal(returnObject.hash, '2N6cvfB4NAPrTMkFrYsezjXfEKZmRVhJi3q');
      });

      it('does not modify the input date', () => {
        const expected = new Date('25 October, 2017, 01:20 GMT+02:00').toString();
        const actual = unlockDate.toString();

        assert.equal(actual, expected);
      });
    });
  });
});
