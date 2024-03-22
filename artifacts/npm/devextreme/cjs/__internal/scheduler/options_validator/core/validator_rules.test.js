/**
* DevExtreme (cjs/__internal/scheduler/options_validator/core/validator_rules.test.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _validator_rules = require("../../../scheduler/options_validator/core/validator_rules");
describe('createValidatorRule', () => {
  it('should add the "name" property to the passed function', () => {
    const expectedResult = 'test-name';
    const result = (0, _validator_rules.createValidatorRule)(expectedResult, () => true);
    expect(result.name).toBe(expectedResult);
  });
});
