const HttpBadRequest = require('../errors/HttpBadRequest');
const HttpInternalServerError = require('../errors/HttpInternalServerError');

function sendTransaction(node, transaction) {
  return new Promise((resolve, reject) => {
    node.services.bitcoind.sendTransaction(transaction, (error, hash) => {
      if (error) {
        return reject(error);
      }

      return resolve(hash);
    });
  });
}

function postTransaction(request, response) {
  const transaction = request.body.transaction;

  return Promise.resolve().then(() => {
    if (!transaction || typeof transaction !== 'string') {
      throw new HttpBadRequest(
        'Transaction must be a transaction serialized in raw format (https://bitcoin.org/en/developer-reference#raw-transaction-format)'
      );
    }

    return sendTransaction(this.node, transaction)
      .then((hash) => {
        response.json({ txid: hash });
      })
      .catch((error) => {
        throw new HttpInternalServerError(error.message);
      });
  });
}

module.exports = postTransaction;
