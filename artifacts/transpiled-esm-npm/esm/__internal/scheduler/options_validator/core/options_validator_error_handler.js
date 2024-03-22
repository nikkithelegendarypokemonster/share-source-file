export class OptionsValidatorErrorHandler {
  constructor(validatorNameToErrorCodeMap, globalErrorHandler) {
    this.validatorNameToErrorCodeMap = validatorNameToErrorCodeMap;
    this.globalErrorHandler = globalErrorHandler;
  }
  handleValidationResult(optionsValidatorResult) {
    if (optionsValidatorResult === true) {
      return;
    }
    var uniqErrorCodes = Object.keys(optionsValidatorResult).reduce((set, validatorName) => {
      var errorCode = this.validatorNameToErrorCodeMap[validatorName];
      if (errorCode) {
        set.add(errorCode);
      }
      return set;
    }, new Set());
    var errorCodeArray = [...uniqErrorCodes];
    errorCodeArray.forEach((errorCode, idx) => {
      var isLastErrorCode = idx === errorCodeArray.length - 1;
      // NOTE: For stopping code stack execution and not creating
      // the special error code for this case,
      // we log all errors and throw the last one.
      if (!isLastErrorCode) {
        this.globalErrorHandler.logError(errorCode);
      } else {
        this.globalErrorHandler.throwError(errorCode);
      }
    });
  }
}