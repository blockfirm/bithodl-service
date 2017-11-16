const assert = require('assert');
const arrayToMap = require('../../src/utils/arrayToMap');

describe('utils/arrayToMap.js', () => {
  describe('arrayToMap(array, key)', () => {
    let array;
    let key;

    beforeEach(() => {
      array = [
        { id: 'eeaf8435-fdb7-4ee8-9b13-c4570f2d28fb' },
        { id: 'fc78e496-b2ce-4159-bc14-58b7d0ea7ee6' },
        { id: 'ad046428-dbb3-442e-816d-65eed01f94fa' }
      ];

      key = 'id';
    });

    it('accepts two arguments', () => {
      const actual = arrayToMap.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('returns the array as an object with "key" as the key', () => {
      const map = arrayToMap(array, key);

      assert.equal(typeof map, 'object');

      array.forEach((item) => {
        assert(item.id in map);
        assert.deepEqual(item, map[item.id]);
      });
    });

    describe('when the array is empty', () => {
      it('returns an empty object', () => {
        const map = arrayToMap([], key);
        const keys = Object.keys(map);

        assert.equal(keys.length, 0);
      });
    });
  });
});
