const HttpInternalServerError = require('../errors/HttpInternalServerError');
const config = require('../config');

function estimateFee(request, response) {
  const numberOfBlocks = config.bitcoin.fee.numberOfBlocks;

  return new Promise((resolve, reject) => {
    this.node.services.bitcoind.estimateFee(numberOfBlocks, (error, feesPerKilobyte) => {
      if (error) {
        return reject(
          new HttpInternalServerError(error.message)
        );
      }

      response.json({ feesPerKilobyte });

      return resolve(feesPerKilobyte);
    });
  });
}

module.exports = estimateFee;
