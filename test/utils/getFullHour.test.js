const assert = require('assert');
const getFullHour = require('../../src/utils/getFullHour');

describe('utils/getFullHour.js', () => {
  describe('getFullHour(date)', () => {
    it('accepts one arguments', () => {
      const actual = getFullHour.length;
      const expected = 1;

      assert.equal(actual, expected);
    });

    it('returns a date', () => {
      const inputDate = new Date('25 October 1989, 01:20');
      const returnDate = getFullHour(inputDate);

      assert(returnDate instanceof Date);
    });

    it('does not modify the input argument', () => {
      const inputDate = new Date('25 October 1989, 01:20:19');
      const expected = inputDate.toString();

      getFullHour(inputDate);

      const actual = inputDate.toString();

      assert.equal(actual, expected);
    });

    it('returns the full hour', () => {
      const inputDate = new Date('25 October 1989, 01:20:19');
      const expected = new Date('25 October 1989, 01:00:00');
      const actual = getFullHour(inputDate);

      assert.equal(actual.toString(), expected.toString());
    });

    describe('when the input date is already a full hour', () => {
      it('returns the same date', () => {
        const inputDate = new Date('25 October 1989, 01:00:00');
        const expected = new Date('25 October 1989, 01:00:00');
        const actual = getFullHour(inputDate);

        assert.equal(actual.toString(), expected.toString());
      });
    });
  });
});
