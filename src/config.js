const config = {
  bitcoin: {
    network: 'testnet', // 'livenet' or 'testnet'
    fee: {
      // The maximum number of blocks a transaction should have to wait before it is
      // predicted to be included in a block. Has to be between 2 and 25 blocks.
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
