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