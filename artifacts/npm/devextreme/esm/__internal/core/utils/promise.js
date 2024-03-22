/**
* DevExtreme (esm/__internal/core/utils/promise.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable spellcheck/spell-checker */
/**
 * This function is substitution for `Promise.withResolvers`
 * and should be replaced by native one once possible
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers}
 */
export function createPromise() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
}
