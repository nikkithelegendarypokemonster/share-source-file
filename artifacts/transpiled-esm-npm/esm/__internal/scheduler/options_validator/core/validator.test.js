import { Validator } from './validator';
var widgetOptions = {
  A: 5,
  B: '5'
};
describe('Validator', () => {
  it('should return "true" if there are no errors', () => {
    var validator = new Validator(_ref => {
      var {
        A
      } = _ref;
      return A;
    }, [() => true, () => true, () => true]);
    var result = validator.validate(widgetOptions);
    expect(result).toBe(true);
  });
  it('should return "true" with empty rules array', () => {
    var validator = new Validator(_ref2 => {
      var {
        A
      } = _ref2;
      return A;
    }, []);
    var result = validator.validate(widgetOptions);
    expect(result).toBe(true);
  });
  it('should return object with errors if some rules return errors', () => {
    var firstFailedRule = () => 'error_1';
    var secondFailedRule = () => 'error_2';
    Object.defineProperty(firstFailedRule, 'name', {
      value: 'rule_1',
      writable: false
    });
    Object.defineProperty(secondFailedRule, 'name', {
      value: 'rule_2',
      writable: false
    });
    var expectedResult = {
      rule_1: 'error_1',
      rule_2: 'error_2'
    };
    var validator = new Validator(_ref3 => {
      var {
        A
      } = _ref3;
      return A;
    }, [firstFailedRule, jest.fn(() => true), secondFailedRule]);
    var result = validator.validate(widgetOptions);
    expect(result).toEqual(expectedResult);
  });
});