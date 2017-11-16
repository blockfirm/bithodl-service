function handleError(error, response) {
  const status = error.status || 500;
  const message = error.message || 'Unknown error';

  response.status(status);
  response.json({ error: message });

  this.node.log.error(`${status} ${message}`);
}

module.exports = handleError;
