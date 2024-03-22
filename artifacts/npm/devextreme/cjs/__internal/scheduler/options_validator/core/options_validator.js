/**
* DevExtreme (cjs/__internal/scheduler/options_validator/core/options_validator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionsValidator = void 0;
let OptionsValidator = exports.OptionsValidator = /*#__PURE__*/function () {
  function OptionsValidator(validators) {
    this.validators = validators;
  }
  var _proto = OptionsValidator.prototype;
  _proto.validate = function validate(options) {
    const errors = Object.entries(this.validators).reduce((result, _ref) => {
      let [validatorName, validator] = _ref;
      const validatorResult = validator.validate(options);
      if (validatorResult !== true) {
        result[validatorName] = validatorResult;
      }
      return result;
    }, {});
    return Object.keys(errors).length > 0 ? errors : true;
  };
  return OptionsValidator;
}();
