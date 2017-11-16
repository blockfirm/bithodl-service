const bitcore = require('bitcore-lib');
const config = require('../config');
const HttpBadRequest = require('../errors/HttpBadRequest');
const HttpInternalServerError = require('../errors/HttpInternalServerError');
const toUnixTimestamp = require('../utils/toUnixTimestamp');
const getAddressUnspentOutputs = require('../bitcoin/getAddressUnspentOutputs');
const getTransaction = require('../bitcoin/getTransaction');

function getBlockTimestamps(node, utxos) {
  const now = toUnixTimestamp(new Date());

  const promises = utxos.map((utxo) => {
    return getTransaction(node, utxo.txid).then((transaction) => {
      const blockTimestamp = transaction.blockTimestamp || utxo.timestamp || now;
      utxo.blockTimestamp = blockTimestamp;
      return utxo;
    });
  });

  return Promise.all(promises);
}

function getUnspentOutputs(request, response) {
  const address = request.params.address;
  const validationError = bitcore.Address.getValidationError(address, config.bitcoin.network);

  return Promise.resolve().then(() => {
    if (validationError) {
      throw new HttpBadRequest(`Invalid address: ${validationError.message}`);
    }

    return getAddressUnspentOutputs(this.node, address)
      .then((utxos) => {
        return getBlockTimestamps(this.node, utxos);
      })
      .then((utxos) => {
        response.json(utxos);
      })
      .catch((error) => {
        throw new HttpInternalServerError(error.message);
      });
  });
}

module.exports = getUnspentOutputs;
