"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _abstract_store = _interopRequireDefault(require("../../data/abstract_store"));
var _array_utils = require("../../data/array_utils");
var _errors = require("../../data/errors");
var _query = _interopRequireDefault(require("../../data/query"));
var _utils = require("../../data/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// @ts-expect-error

// @ts-expect-error
const ArrayStore = _abstract_store.default.inherit({
  ctor(options) {
    if (Array.isArray(options)) {
      options = {
        data: options
      };
    } else {
      options = options || {};
    }
    this.callBase(options);
    const initialArray = options.data;
    if (initialArray && !Array.isArray(initialArray)) {
      throw _errors.errors.Error('E4006');
    }
    this._array = initialArray || [];
  },
  createQuery() {
    return (0, _query.default)(this._array, {
      errorHandler: this._errorHandler
    });
  },
  _byKeyImpl(key) {
    const index = (0, _array_utils.indexByKey)(this, this._array, key);
    if (index === -1) {
      return (0, _utils.rejectedPromise)(_errors.errors.Error('E4009'));
    }
    return (0, _utils.trivialPromise)(this._array[index]);
  },
  _insertImpl(values) {
    // @ts-expect-error
    return (0, _array_utils.insert)(this, this._array, values);
  },
  _pushImpl(changes) {
    // @ts-expect-error
    (0, _array_utils.applyBatch)({
      keyInfo: this,
      data: this._array,
      changes
    });
  },
  _updateImpl(key, values) {
    // @ts-expect-error
    return (0, _array_utils.update)(this, this._array, key, values);
  },
  _removeImpl(key) {
    // @ts-expect-error
    return (0, _array_utils.remove)(this, this._array, key);
  },
  clear() {
    this._eventsStrategy.fireEvent('modifying');
    this._array = [];
    this._eventsStrategy.fireEvent('modified');
  }
}, 'array');
var _default = exports.default = ArrayStore;