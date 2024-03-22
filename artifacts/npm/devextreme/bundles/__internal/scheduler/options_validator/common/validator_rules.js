/**
* DevExtreme (bundles/__internal/scheduler/options_validator/common/validator_rules.js)
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
exports.mustBeLessThan = exports.mustBeInteger = exports.mustBeInRange = exports.mustBeGreaterThan = exports.mustBeDivisibleBy = void 0;
var _index = require("../core/index");
var _validation_functions = require("./validation_functions");
const mustBeInteger = exports.mustBeInteger = (0, _index.createValidatorRule)('mustBeInteger', value => (0, _validation_functions.isInteger)(value) || "".concat(value, " must be an integer."));
const mustBeGreaterThan = function (minimalValue) {
  let strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0, _index.createValidatorRule)('mustBeGreaterThan', value => (0, _validation_functions.greaterThan)(value, minimalValue, strict) || "".concat(value, " must be ").concat(strict ? '>' : '>=', " than ").concat(minimalValue, "."));
};
exports.mustBeGreaterThan = mustBeGreaterThan;
const mustBeLessThan = function (maximalValue) {
  let strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0, _index.createValidatorRule)('mustBeLessThan', value => (0, _validation_functions.lessThan)(value, maximalValue, strict) || "".concat(value, " must be ").concat(strict ? '<' : '<=', " than ").concat(maximalValue, "."));
};
exports.mustBeLessThan = mustBeLessThan;
const mustBeInRange = range => (0, _index.createValidatorRule)('mustBeInRange', value => (0, _validation_functions.inRange)(value, range) || "".concat(value, " must be in range [").concat(range[0], ", ").concat(range[1], "]."));
exports.mustBeInRange = mustBeInRange;
const mustBeDivisibleBy = divider => (0, _index.createValidatorRule)('mustBeDivisibleBy', value => (0, _validation_functions.divisibleBy)(value, divider) || "".concat(value, " must be divisible by ").concat(divider, "."));
exports.mustBeDivisibleBy = mustBeDivisibleBy;
