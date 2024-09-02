/**
* DevExtreme (esm/core/utils/locker.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import errors from '../errors';
const Locker = function () {
  const info = {};
  const currentCount = function (lockName) {
    return info[lockName] || 0;
  };
  return {
    obtain: function (lockName) {
      info[lockName] = currentCount(lockName) + 1;
    },
    release: function (lockName) {
      const count = currentCount(lockName);
      if (count < 1) {
        throw errors.Error('E0014');
      }
      if (count === 1) {
        delete info[lockName];
      } else {
        info[lockName] = count - 1;
      }
    },
    locked: function (lockName) {
      return currentCount(lockName) > 0;
    }
  };
};
export default Locker;
