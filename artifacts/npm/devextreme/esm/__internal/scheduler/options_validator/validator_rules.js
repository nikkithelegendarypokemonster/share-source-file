/**
* DevExtreme (esm/__internal/scheduler/options_validator/validator_rules.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { divisibleBy, greaterThan, lessThan } from './common/index';
import { createValidatorRule } from './core/index';
export const endDayHourMustBeGreaterThanStartDayHour = createValidatorRule('endDayHourGreaterThanStartDayHour', _ref => {
  let {
    startDayHour,
    endDayHour
  } = _ref;
  return greaterThan(endDayHour, startDayHour) || `endDayHour: ${endDayHour} must be greater that startDayHour: ${startDayHour}.`;
});
export const visibleIntervalMustBeDivisibleByCellDuration = createValidatorRule('visibleIntervalMustBeDivisibleByCellDuration', _ref2 => {
  let {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref2;
  const visibleInterval = (endDayHour - startDayHour) * 60;
  return divisibleBy(visibleInterval, cellDuration) || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be divisible by cellDuration: ${cellDuration} (minutes).`;
});
export const cellDurationMustBeLessThanVisibleInterval = createValidatorRule('cellDurationMustBeLessThanVisibleInterval', _ref3 => {
  let {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref3;
  const visibleInterval = (endDayHour - startDayHour) * 60;
  return lessThan(cellDuration, visibleInterval, false) || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be greater or equal the cellDuration: ${cellDuration} (minutes).`;
});
