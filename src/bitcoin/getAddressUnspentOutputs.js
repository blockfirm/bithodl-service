function getAddressUnspentOutputs(node, addresses) {
  return new Promise((resolve, reject) => {
    node.getAddressUnspentOutputs(addresses, {}, (error, utxos) => {
      if (error) {
        return reject(error);
      }

      return resolve(utxos);
    });
  });
}

module.exports = getAddressUnspentOutputs;
