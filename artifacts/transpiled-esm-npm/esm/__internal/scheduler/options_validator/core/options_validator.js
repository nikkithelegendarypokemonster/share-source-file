export class OptionsValidator {
  constructor(validators) {
    this.validators = validators;
  }
  validate(options) {
    var errors = Object.entries(this.validators).reduce((result, _ref) => {
      var [validatorName, validator] = _ref;
      var validatorResult = validator.validate(options);
      if (validatorResult !== true) {
        result[validatorName] = validatorResult;
      }
      return result;
    }, {});
    return Object.keys(errors).length > 0 ? errors : true;
  }
}