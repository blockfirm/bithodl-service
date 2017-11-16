function getAllHours(start, end) {
  const dates = [];
  const current = new Date(start);

  while (current < end) {
    dates.push(new Date(current));
    current.setHours(current.getHours() + 1);
  }

  return dates;
}

module.exports = getAllHours;
