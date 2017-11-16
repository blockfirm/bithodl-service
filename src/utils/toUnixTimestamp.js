function toUnixTimestamp(date) {
  return date.getTime() / 1000;
}

module.exports = toUnixTimestamp;
