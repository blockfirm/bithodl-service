const config = {
  bitcoin: {
    network: 'testnet',
    fee: {
      numberOfBlocks: 3
    }
  },
  api: {
    version: 'v1'
  },
  scan: {
    startDate: '10 September, 2017',
    lookaheadYears: 10
  }
};

module.exports = config;
