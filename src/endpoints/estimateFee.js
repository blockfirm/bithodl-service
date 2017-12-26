const HttpInternalServerError = require('../errors/HttpInternalServerError');
const config = require('../config');

function estimateFee(request, response) {
  const numberOfBlocks = config.bitcoin.fee.numberOfBlocks;

  return new Promise((resolve, reject) => {
    this.node.services.bitcoind.estimateFee(numberOfBlocks, (error, btcPerKilobyte) => {
      if (error) {
        return reject(
          new HttpInternalServerError(error.message)
        );
      }

      const btcPerByte = btcPerKilobyte / 1000;
      const satoshisPerByte = Math.round(btcPerByte * 100000000);

      response.json({ satoshisPerByte });

      resolve();
    });
  });
}

module.exports = estimateFee;
