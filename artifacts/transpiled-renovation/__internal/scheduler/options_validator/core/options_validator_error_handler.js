"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionsValidatorErrorHandler = void 0;
let OptionsValidatorErrorHandler = exports.OptionsValidatorErrorHandler = /*#__PURE__*/function () {
  function OptionsValidatorErrorHandler(validatorNameToErrorCodeMap, globalErrorHandler) {
    this.validatorNameToErrorCodeMap = validatorNameToErrorCodeMap;
    this.globalErrorHandler = globalErrorHandler;
  }
  var _proto = OptionsValidatorErrorHandler.prototype;
  _proto.handleValidationResult = function handleValidationResult(optionsValidatorResult) {
    if (optionsValidatorResult === true) {
      return;
    }
    const uniqErrorCodes = Object.keys(optionsValidatorResult).reduce((set, validatorName) => {
      const errorCode = this.validatorNameToErrorCodeMap[validatorName];
      if (errorCode) {
        set.add(errorCode);
      }
      return set;
    }, new Set());
    const errorCodeArray = [...uniqErrorCodes];
    errorCodeArray.forEach((errorCode, idx) => {
      const isLastErrorCode = idx === errorCodeArray.length - 1;
      // NOTE: For stopping code stack execution and not creating
      // the special error code for this case,
      // we log all errors and throw the last one.
      if (!isLastErrorCode) {
        this.globalErrorHandler.logError(errorCode);
      } else {
        this.globalErrorHandler.throwError(errorCode);
      }
    });
  };
  return OptionsValidatorErrorHandler;
}();