/**
* DevExtreme (cjs/ui/html_editor/modules/base.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _empty = _interopRequireDefault(require("./empty"));
var _type = require("../../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let BaseModule = _empty.default;
if (_devextremeQuill.default) {
  const BaseQuillModule = _devextremeQuill.default.import('core/module');
  BaseModule = /*#__PURE__*/function (_BaseQuillModule) {
    _inheritsLoose(BaseHtmlEditorModule, _BaseQuillModule);
    function BaseHtmlEditorModule(quill, options) {
      var _this;
      _this = _BaseQuillModule.call(this, quill, options) || this;
      _this.editorInstance = options.editorInstance;
      return _this;
    }
    var _proto = BaseHtmlEditorModule.prototype;
    _proto.saveValueChangeEvent = function saveValueChangeEvent(event) {
      this.editorInstance._saveValueChangeEvent(event);
    };
    _proto.addCleanCallback = function addCleanCallback(callback) {
      this.editorInstance.addCleanCallback(callback);
    };
    _proto.handleOptionChangeValue = function handleOptionChangeValue(changes) {
      if ((0, _type.isObject)(changes)) {
        Object.entries(changes).forEach(_ref => {
          let [name, value] = _ref;
          return this.option(name, value);
        });
      } else if (!(0, _type.isDefined)(changes)) {
        this === null || this === void 0 ? void 0 : this.clean();
      }
    };
    return BaseHtmlEditorModule;
  }(BaseQuillModule);
}
var _default = exports.default = BaseModule;
module.exports = exports.default;
module.exports.default = exports.default;
