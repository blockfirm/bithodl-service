const assert = require('assert');
const sinon = require('sinon');
const handleError = require('../src/handleError');

describe('handleError.js', () => {
  describe('handleError(error, response)', () => {
    let fakeResponse;
    let fakeNode;
    let fakeThis;

    beforeEach(() => {
      fakeResponse = {
        status: sinon.spy(),
        json: sinon.spy()
      };

      fakeNode = {
        log: {
          error: sinon.spy()
        }
      };

      fakeThis = {
        node: fakeNode
      };
    });

    it('accepts two arguments', () => {
      const actual = handleError.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('logs the error status and message using this.node.log.error()', () => {
      const errorStatus = 404;
      const errorMessage = 'bacd8b78-cb98-43e0-8600-63bc6e88a8af';
      const error = new Error(errorMessage);

      error.status = errorStatus;
      handleError.call(fakeThis, error, fakeResponse);

      const firstArgument = fakeThis.node.log.error.getCall(0).args[0];

      assert(fakeThis.node.log.error.calledOnce);
      assert(firstArgument.indexOf(errorStatus) > -1);
      assert(firstArgument.indexOf(errorMessage) > -1);
    });

    it('calls response.status() with the error status', () => {
      const errorStatus = 404;
      const errorMessage = '254db1ff-ca36-41e8-b7c3-a96ec2d944d9';
      const error = new Error(errorMessage);

      error.status = errorStatus;
      handleError.call(fakeThis, error, fakeResponse);

      assert(fakeResponse.status.calledOnce);
      assert(fakeResponse.status.calledWith(errorStatus));
    });

    it('calls response.json() with the error message wrapped in an object', () => {
      const errorStatus = 404;
      const errorMessage = '4e251deb-d364-4c3d-87ac-54ca80d41454';
      const error = new Error(errorMessage);

      error.status = errorStatus;
      handleError.call(fakeThis, error, fakeResponse);

      assert(fakeResponse.json.calledOnce);
      assert(fakeResponse.json.calledWith({ error: errorMessage }));
    });

    describe('when error.status is undefined', () => {
      it('defaults to 500', () => {
        const errorMessage = '73428bc4-e34e-4e67-8acf-b92c866e7f9c';
        const error = new Error(errorMessage);

        handleError.call(fakeThis, error, fakeResponse);

        assert(fakeResponse.status.calledOnce);
        assert(fakeResponse.status.calledWith(500));
      });
    });

    describe('when error.message is undefined', () => {
      it('defaults to "Unknown error"', () => {
        const error = new Error();

        handleError.call(fakeThis, error, fakeResponse);

        assert(fakeResponse.json.calledOnce);
        assert(fakeResponse.json.calledWith({ error: 'Unknown error' }));
      });
    });
  });
});
