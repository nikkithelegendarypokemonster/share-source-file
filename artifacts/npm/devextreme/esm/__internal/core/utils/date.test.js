/**
* DevExtreme (esm/__internal/core/utils/date.test.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import each from 'jest-each';
import { dateUtilsTs } from './date';
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
describe('Date utils', () => {
  describe('addOffsets function', () => {
    each`
         offsets | expectedResult
         ${[0]} | ${new Date('2023-09-05T00:00:00Z')}
         ${[SECOND_MS]} | ${new Date('2023-09-05T00:00:01Z')}
         ${[-HOUR_MS]} | ${new Date('2023-09-04T23:00:00Z')}
         ${[2 * HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T01:00:00Z')}
         ${[SECOND_MS, MINUTE_MS, HOUR_MS, DAY_MS]} | ${new Date('2023-09-06T01:01:01Z')}
         ${[-SECOND_MS, -MINUTE_MS, -HOUR_MS, -DAY_MS]} | ${new Date('2023-09-03T22:58:59Z')}
         ${[HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T00:00:00Z')}
    `.it('should add ms offsets to date correctly', _ref => {
      let {
        offsets,
        expectedResult
      } = _ref;
      const date = new Date('2023-09-05T00:00:00Z');
      const result = dateUtilsTs.addOffsets(date, offsets);
      expect(result).toEqual(expectedResult);
    });
  });
});
