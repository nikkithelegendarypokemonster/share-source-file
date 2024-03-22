/**
* DevExtreme (esm/__internal/scheduler/options_validator/core/validator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export class Validator {
  constructor(valueSelector, rules) {
    this.valueSelector = valueSelector;
    this.rules = rules;
  }
  validate(options) {
    var value = this.valueSelector(options);
    var errors = this.rules.reduce((result, rule) => {
      var validationResult = rule(value);
      if (validationResult !== true) {
        result[rule.name] = validationResult;
      }
      return result;
    }, {});
    return Object.keys(errors).length ? errors : true;
  }
}
