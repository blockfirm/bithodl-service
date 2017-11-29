function toUnixTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

module.exports = toUnixTimestamp;
