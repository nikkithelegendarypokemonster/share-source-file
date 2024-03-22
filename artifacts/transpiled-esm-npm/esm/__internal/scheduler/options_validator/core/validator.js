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