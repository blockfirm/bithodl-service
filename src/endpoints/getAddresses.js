const bitcore = require('bitcore-lib');
const HttpBadRequest = require('../errors/HttpBadRequest');
const HttpInternalServerError = require('../errors/HttpInternalServerError');
const arrayToMap = require('../utils/arrayToMap');
const toUnixTimestamp = require('../utils/toUnixTimestamp');
const getPossibleAddresses = require('../bitcoin/getPossibleAddresses');
const getAddressUnspentOutputs = require('../bitcoin/getAddressUnspentOutputs');
const getTransaction = require('../bitcoin/getTransaction');

function mapUtxosToAddresses(utxos, possibleAddresses) {
  const addressMap = arrayToMap(possibleAddresses, 'hash');

  return utxos.map((utxo) => {
    const address = addressMap[utxo.address];

    return {
      hash: address.hash,
      script: address.script,
      unlockTimestamp: address.unlockTimestamp,
      utxo
    };
  });
}

function getBlockTimestamps(node, addresses) {
  const now = toUnixTimestamp(new Date());

  const promises = addresses.map((address) => {
    return getTransaction(node, address.utxo.txid).then((transaction) => {
      const blockTimestamp = transaction.blockTimestamp || now;
      address.utxo.blockTimestamp = blockTimestamp;
      return address;
    });
  });

  return Promise.all(promises);
}

function getUnspentAddresses(node, publicKey) {
  const possibleAddresses = getPossibleAddresses(publicKey);
  const possibleHashes = possibleAddresses.map(address => address.hash);

  return getAddressUnspentOutputs(node, possibleHashes)
    .then((utxos) => {
      return mapUtxosToAddresses(utxos, possibleAddresses);
    })
    .then((addresses) => {
      return getBlockTimestamps(node, addresses);
    });
}

function getAddresses(request, response) {
  const publicKeyString = request.params.publicKey;

  return Promise.resolve().then(() => {
    if (!bitcore.PublicKey.isValid(publicKeyString)) {
      throw new HttpBadRequest('Invalid public key');
    }

    const publicKey = new bitcore.PublicKey(publicKeyString);

    return getUnspentAddresses(this.node, publicKey)
      .then((addresses) => {
        response.json(addresses);
      })
      .catch((error) => {
        throw new HttpInternalServerError(error.message);
      });
  });
}

module.exports = getAddresses;
