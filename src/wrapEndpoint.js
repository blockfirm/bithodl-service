const handleError = require('./handleError');

function wrapEndpoint(endpoint, thisArg) {
  return (request, response, next) => {
    try {
      return endpoint.call(thisArg, request, response, next).catch((error) => {
        handleError.call(thisArg, error, response);
      });
    } catch (error) {
      handleError.call(thisArg, error, response);
    }
  };
}

module.exports = wrapEndpoint;
