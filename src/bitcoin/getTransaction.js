function getTransaction(node, txid) {
  return new Promise((resolve, reject) => {
    node.services.bitcoind.getDetailedTransaction(txid, (error, transaction) => {
      if (error) {
        return reject(error);
      }

      return resolve(transaction);
    });
  });
}

module.exports = getTransaction;
