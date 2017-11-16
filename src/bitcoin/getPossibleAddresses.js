const config = require('../config');
const getAllHours = require('../utils/getAllHours');
const createLockedAddress = require('../bitcoin/createLockedAddress');

function getEndDate(lookaheadYears) {
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + lookaheadYears);
  return endDate;
}

function getPossibleAddresses(publicKey) {
  const startDate = new Date(config.scan.startDate);
  const endDate = getEndDate(config.scan.lookaheadYears);
  const dates = getAllHours(startDate, endDate);

  const addresses = dates.map((date) => {
    return createLockedAddress(publicKey, date);
  });

  return addresses;
}

module.exports = getPossibleAddresses;
