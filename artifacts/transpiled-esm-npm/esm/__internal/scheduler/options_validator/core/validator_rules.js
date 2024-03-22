export var createValidatorRule = (name, ruleFunc) => {
  Object.defineProperty(ruleFunc, 'name', {
    value: name,
    writable: false
  });
  return ruleFunc;
};