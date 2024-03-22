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