import { createValidatorRule } from '../../../scheduler/options_validator/core/validator_rules';
describe('createValidatorRule', () => {
  it('should add the "name" property to the passed function', () => {
    var expectedResult = 'test-name';
    var result = createValidatorRule(expectedResult, () => true);
    expect(result.name).toBe(expectedResult);
  });
});