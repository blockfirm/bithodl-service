function arrayToMap(array, key) {
  const map = {};

  array.forEach((item) => {
    map[item[key]] = item;
  });

  return map;
}

module.exports = arrayToMap;
