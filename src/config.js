const config = {
  bitcoin: {
    network: 'testnet', // 'livenet' or 'testnet'
    fee: {
      // Number of blocks to use when estimating the fee.
      numberOfBlocks: 3
    }
  },
  api: {
    version: 'v1'
  },
  scan: {
    // Date to start looking for BitHodl addresses from.
    startDate: '10 September, 2017',

    // How many years to look into the future when scanning for BitHodl addresses.
    lookaheadYears: 10
  }
};

module.exports = config;
