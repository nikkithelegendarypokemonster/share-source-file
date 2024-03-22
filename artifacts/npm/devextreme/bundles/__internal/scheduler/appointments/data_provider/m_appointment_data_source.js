/**
* DevExtreme (bundles/__internal/scheduler/appointments/data_provider/m_appointment_data_source.js)
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
exports.AppointmentDataSource = void 0;
var _deferred = require("../../../../core/utils/deferred");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const STORE_EVENTS = {
  updating: 'updating',
  push: 'push'
};
let AppointmentDataSource = exports.AppointmentDataSource = /*#__PURE__*/function () {
  function AppointmentDataSource(dataSource) {
    this.setDataSource(dataSource);
    this._updatedAppointmentKeys = [];
  }
  var _proto = AppointmentDataSource.prototype;
  _proto._getStoreKey = function _getStoreKey(target) {
    const store = this._dataSource.store();
    return store.keyOf(target);
  };
  _proto.setDataSource = function setDataSource(dataSource) {
    this._dataSource = dataSource;
    this.cleanState();
    this._initStoreChangeHandlers();
  };
  _proto._initStoreChangeHandlers = function _initStoreChangeHandlers() {
    const dataSource = this._dataSource;
    const store = dataSource === null || dataSource === void 0 ? void 0 : dataSource.store();
    if (store) {
      store.on(STORE_EVENTS.updating, key => {
        const keyName = store.key();
        if (keyName) {
          this._updatedAppointmentKeys.push({
            key: keyName,
            value: key
          });
        } else {
          this._updatedAppointment = key;
        }
      });
      store.on(STORE_EVENTS.push, pushItems => {
        const items = dataSource.items();
        const keyName = store.key();
        pushItems.forEach(pushItem => {
          const itemExists = items.filter(item => item[keyName] === pushItem.key).length !== 0;
          if (itemExists) {
            this._updatedAppointmentKeys.push({
              key: keyName,
              value: pushItem.key
            });
          } else {
            const {
              data
            } = pushItem;
            data && items.push(data);
          }
        });
        dataSource.load();
      });
    }
  };
  _proto.getUpdatedAppointment = function getUpdatedAppointment() {
    return this._updatedAppointment;
  };
  _proto.getUpdatedAppointmentKeys = function getUpdatedAppointmentKeys() {
    return this._updatedAppointmentKeys;
  };
  _proto.cleanState = function cleanState() {
    this._updatedAppointment = null;
    this._updatedAppointmentKeys = [];
  };
  _proto.add = function add(rawAppointment) {
    return this._dataSource.store().insert(rawAppointment).done(() => this._dataSource.load());
  };
  _proto.update = function update(target, data) {
    const key = this._getStoreKey(target);
    // @ts-expect-error
    const d = new _deferred.Deferred();
    this._dataSource.store().update(key, data).done(result => this._dataSource.load().done(() => d.resolve(result)).fail(d.reject)).fail(d.reject);
    return d.promise();
  };
  _proto.remove = function remove(rawAppointment) {
    const key = this._getStoreKey(rawAppointment);
    return this._dataSource.store().remove(key).done(() => this._dataSource.load());
  };
  _proto.destroy = function destroy() {
    var _a;
    const store = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.store();
    if (store) {
      store.off(STORE_EVENTS.updating);
      store.off(STORE_EVENTS.push);
    }
  };
  _createClass(AppointmentDataSource, [{
    key: "keyName",
    get: function () {
      const store = this._dataSource.store();
      return store.key();
    }
  }, {
    key: "isDataSourceInit",
    get: function () {
      return !!this._dataSource;
    }
  }]);
  return AppointmentDataSource;
}();
