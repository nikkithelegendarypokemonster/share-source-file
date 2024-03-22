/**
* DevExtreme (esm/__internal/scheduler/options_validator/options_validator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { mustBeDivisibleBy, mustBeGreaterThan, mustBeInRange, mustBeInteger } from './common/index';
import { OptionsValidator, Validator } from './core/index';
import { cellDurationMustBeLessThanVisibleInterval, endDayHourMustBeGreaterThanStartDayHour, visibleIntervalMustBeDivisibleByCellDuration } from './validator_rules';
export class SchedulerOptionsValidator extends OptionsValidator {
  constructor() {
    super({
      startDayHour: new Validator(_ref => {
        var {
          startDayHour
        } = _ref;
        return startDayHour;
      }, [mustBeInteger, mustBeInRange([0, 24])]),
      endDayHour: new Validator(_ref2 => {
        var {
          endDayHour
        } = _ref2;
        return endDayHour;
      }, [mustBeInteger, mustBeInRange([0, 24])]),
      offset: new Validator(_ref3 => {
        var {
          offset
        } = _ref3;
        return offset;
      }, [mustBeInteger, mustBeInRange([-1440, 1440]), mustBeDivisibleBy(5)]),
      cellDuration: new Validator(_ref4 => {
        var {
          cellDuration
        } = _ref4;
        return cellDuration;
      }, [mustBeInteger, mustBeGreaterThan(0)]),
      startDayHourAndEndDayHour: new Validator(options => options, [endDayHourMustBeGreaterThanStartDayHour]),
      cellDurationAndVisibleInterval: new Validator(options => options, [visibleIntervalMustBeDivisibleByCellDuration, cellDurationMustBeLessThanVisibleInterval])
    });
  }
}
