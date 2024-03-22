/**
* DevExtreme (esm/__internal/scheduler/options_validator/validator_rules.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { divisibleBy, greaterThan, lessThan } from './common/index';
import { createValidatorRule } from './core/index';
export var endDayHourMustBeGreaterThanStartDayHour = createValidatorRule('endDayHourGreaterThanStartDayHour', _ref => {
  var {
    startDayHour,
    endDayHour
  } = _ref;
  return greaterThan(endDayHour, startDayHour) || "endDayHour: ".concat(endDayHour, " must be greater that startDayHour: ").concat(startDayHour, ".");
});
export var visibleIntervalMustBeDivisibleByCellDuration = createValidatorRule('visibleIntervalMustBeDivisibleByCellDuration', _ref2 => {
  var {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref2;
  var visibleInterval = (endDayHour - startDayHour) * 60;
  return divisibleBy(visibleInterval, cellDuration) || "endDayHour - startDayHour: ".concat(visibleInterval, " (minutes), must be divisible by cellDuration: ").concat(cellDuration, " (minutes).");
});
export var cellDurationMustBeLessThanVisibleInterval = createValidatorRule('cellDurationMustBeLessThanVisibleInterval', _ref3 => {
  var {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref3;
  var visibleInterval = (endDayHour - startDayHour) * 60;
  return lessThan(cellDuration, visibleInterval, false) || "endDayHour - startDayHour: ".concat(visibleInterval, " (minutes), must be greater or equal the cellDuration: ").concat(cellDuration, " (minutes).");
});
