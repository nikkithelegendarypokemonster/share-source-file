/**
* DevExtreme (cjs/core/templates/bindable_template.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.BindableTemplate = void 0;
var _renderer = _interopRequireDefault(require("../renderer"));
var _template_base = require("./template_base");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _remove = require("../../events/remove");
var _type = require("../utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const watchChanges = function () {
  const globalWatch = (data, watchMethod, callback) => watchMethod(() => data, callback);
  const fieldsWatch = function (data, watchMethod, fields, fieldsMap, callback) {
    const resolvedData = {};
    const missedFields = fields.slice();
    const watchHandlers = fields.map(function (name) {
      const fieldGetter = fieldsMap[name];
      return watchMethod(fieldGetter ? () => fieldGetter(data) : () => data[name], function (value) {
        resolvedData[name] = value;
        if (missedFields.length) {
          const index = missedFields.indexOf(name);
          if (index >= 0) {
            missedFields.splice(index, 1);
          }
        }
        if (!missedFields.length) {
          callback(resolvedData);
        }
      });
    });
    return function () {
      watchHandlers.forEach(dispose => dispose());
    };
  };
  return function (rawData, watchMethod, fields, fieldsMap, callback) {
    let fieldsDispose;
    const globalDispose = globalWatch(rawData, watchMethod, function (dataWithRawFields) {
      fieldsDispose && fieldsDispose();
      if ((0, _type.isPrimitive)(dataWithRawFields)) {
        callback(dataWithRawFields);
        return;
      }
      fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback);
    });
    return function () {
      fieldsDispose && fieldsDispose();
      globalDispose && globalDispose();
    };
  };
}();
let BindableTemplate = exports.BindableTemplate = /*#__PURE__*/function (_TemplateBase) {
  _inheritsLoose(BindableTemplate, _TemplateBase);
  function BindableTemplate(render, fields, watchMethod, fieldsMap) {
    var _this;
    _this = _TemplateBase.call(this) || this;
    _this._render = render;
    _this._fields = fields;
    _this._fieldsMap = fieldsMap || {};
    _this._watchMethod = watchMethod;
    return _this;
  }
  var _proto = BindableTemplate.prototype;
  _proto._renderCore = function _renderCore(options) {
    const $container = (0, _renderer.default)(options.container);
    const dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, data => {
      $container.empty();
      this._render($container, data, options.model);
    });
    _events_engine.default.on($container, _remove.removeEvent, dispose);
    return $container.contents();
  };
  return BindableTemplate;
}(_template_base.TemplateBase);
