class HttpBadRequest extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, HttpBadRequest);
    this.status = 400;
  }
}

module.exports = HttpBadRequest;
