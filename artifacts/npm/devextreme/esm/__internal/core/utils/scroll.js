/**
* DevExtreme (esm/__internal/core/utils/scroll.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function getMemoizeScrollTo(getScrollableInstance) {
  const instance = getScrollableInstance();
  let lastParams = {};
  return function (params) {
    let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const normalizedParams = {
      top: params.top !== undefined ? Math.ceil(params.top) : undefined,
      left: params.left !== undefined ? Math.ceil(params.left) : undefined
    };
    const isSameParams = normalizedParams.top === lastParams.top && normalizedParams.left === lastParams.left;
    if (!force && isSameParams) {
      return;
    }
    lastParams = normalizedParams;
    instance.scrollTo(params);
  };
}
