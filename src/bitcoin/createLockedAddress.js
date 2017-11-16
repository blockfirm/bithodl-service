const bitcore = require('bitcore-lib');
const config = require('../config');
const getFullHour = require('../utils/getFullHour');
const toUnixTimestamp = require('../utils/toUnixTimestamp');

function createLockedAddress(publicKey, unlockDate) {
  const normalizedUnlockDate = getFullHour(unlockDate);
  const unlockTimestamp = toUnixTimestamp(normalizedUnlockDate);

  const script = bitcore.Script.empty()
    .add(bitcore.crypto.BN.fromNumber(unlockTimestamp).toScriptNumBuffer())
    .add('OP_CHECKLOCKTIMEVERIFY')
    .add('OP_DROP')
    .add(bitcore.Script.buildPublicKeyHashOut(publicKey.toAddress(config.bitcoin.network)));

  const address = bitcore.Address.payingTo(script, config.bitcoin.network);

  return {
    hash: address.toString(),
    script: script.toString(),
    unlockTimestamp
  };
}

module.exports = createLockedAddress;
