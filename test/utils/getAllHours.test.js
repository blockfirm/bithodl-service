const assert = require('assert');
const getAllHours = require('../../src/utils/getAllHours');

describe('utils/getAllHours.js', () => {
  describe('getAllHours(start, end)', () => {
    it('accepts two arguments', () => {
      const actual = getAllHours.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns an array', () => {
      const start = new Date('25 October 1989, 00:00 GMT+02:00');
      const end = new Date('26 October 1989, 00:00 GMT+02:00');
      const hours = getAllHours(start, end);

      assert(Array.isArray(hours));
    });

    it('does not modify the input arguments', () => {
      const start = new Date('25 October 1989, 00:00 GMT+02:00');
      const end = new Date('26 October 1989, 00:00 GMT+02:00');

      getAllHours(start, end);

      assert.equal(start.toString(), new Date('25 October 1989, 00:00 GMT+02:00').toString());
      assert.equal(end.toString(), new Date('26 October 1989, 00:00 GMT+02:00').toString());
    });

    describe('when passing the dates 25 Oct and 26 Oct', () => {
      let start;
      let end;

      beforeEach(() => {
        start = new Date('25 October 1989, 00:00 GMT+02:00');
        end = new Date('26 October 1989, 00:00 GMT+02:00');
      });

      it('returns 24 dates', () => {
        const hours = getAllHours(start, end);

        assert.equal(hours.length, 24);

        hours.forEach((hour) => {
          assert(hour instanceof Date);
        });
      });

      it('returns every hour between the specified dates', () => {
        const hours = getAllHours(start, end);
        const expected = new Date(start);

        hours.forEach((hour) => {
          assert.equal(hour.toString(), expected.toString());
          expected.setHours(expected.getHours() + 1);
        });
      });
    });
  });
});
