/**
* DevExtreme (cjs/__internal/scheduler/options_validator/common/validator_rules.test.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _validator_rules = require("../../../scheduler/options_validator/common/validator_rules");
var validationFunctions = _interopRequireWildcard(require("./validation_functions"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
describe('mustBeInteger', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'isInteger');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call isInteger function', () => {
    (0, _validator_rules.mustBeInteger)(10);
    expect(mock).toHaveBeenCalledWith(10);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    const result = (0, _validator_rules.mustBeInteger)(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const result = (0, _validator_rules.mustBeInteger)(10.5);
    expect(result).toBe('10.5 must be an integer.');
  });
  it('should be the function with the correct name', () => {
    const func = _validator_rules.mustBeInteger;
    expect(func.name).toBe('mustBeInteger');
  });
});
describe('mustBeGreaterThan', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call greaterThan function', () => {
    const func = (0, _validator_rules.mustBeGreaterThan)(10, true);
    func(15);
    expect(mock).toHaveBeenCalledWith(15, 10, true);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeGreaterThan)(10, true);
    const result = func(15);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeGreaterThan)(15, true);
    const result = func(10);
    expect(result).toBe('10 must be > than 15.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeGreaterThan)(15, false);
    const result = func(10);
    expect(result).toBe('10 must be >= than 15.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeGreaterThan)(15, false);
    expect(func.name).toBe('mustBeGreaterThan');
  });
});
describe('mustBeLessThan', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call lessThan function', () => {
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, 10, true);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    const result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    const result = func(15);
    expect(result).toBe('15 must be < than 10.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeLessThan)(10, false);
    const result = func(15);
    expect(result).toBe('15 must be <= than 10.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeLessThan)(15, false);
    expect(func.name).toBe('mustBeLessThan');
  });
});
describe('mustBeInRange', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'inRange');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call inRange function', () => {
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, [0, 10]);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    const result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    const result = func(15);
    expect(result).toBe('15 must be in range [0, 10].');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    expect(func.name).toBe('mustBeInRange');
  });
});
describe('mustBeDivisibleBy', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call divisibleBy function', () => {
    const func = (0, _validator_rules.mustBeDivisibleBy)(10);
    func(100);
    expect(mock).toHaveBeenCalledWith(100, 10);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    const result = func(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    const result = func(6);
    expect(result).toBe('6 must be divisible by 5.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    expect(func.name).toBe('mustBeDivisibleBy');
  });
});
