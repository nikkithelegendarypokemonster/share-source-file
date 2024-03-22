/**
* DevExtreme (renovation/component_wrapper/button.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _validation_engine = _interopRequireDefault(require("../../ui/validation_engine"));
var _component = _interopRequireDefault(require("./common/component"));
var _icon = require("../../core/utils/icon");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ButtonWrapper = exports.default = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ButtonWrapper, _Component);
  function ButtonWrapper() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = ButtonWrapper.prototype;
  _proto.getDefaultTemplateNames = function getDefaultTemplateNames() {
    return ['content'];
  };
  _proto.getSupportedKeyNames = function getSupportedKeyNames() {
    return ['space', 'enter'];
  };
  _proto.getProps = function getProps() {
    const props = _Component.prototype.getProps.call(this);
    props.onClick = _ref => {
      let {
        event
      } = _ref;
      this._clickAction({
        event,
        validationGroup: this._validationGroupConfig
      });
    };
    const iconType = (0, _icon.getImageSourceType)(props.icon);
    if (iconType === 'svg') {
      props.iconTemplate = this._createTemplateComponent(() => props.icon);
    }
    return props;
  };
  _proto._toggleActiveState = function _toggleActiveState(_, value) {
    const button = this.viewRef;
    value ? button.activate() : button.deactivate();
  };
  _proto._getSubmitAction = function _getSubmitAction() {
    let needValidate = true;
    let validationStatus = 'valid';
    return this._createAction(_ref2 => {
      let {
        event,
        submitInput
      } = _ref2;
      if (needValidate) {
        const validationGroup = this._validationGroupConfig;
        if (validationGroup !== undefined && validationGroup !== '') {
          const validationResult = validationGroup.validate();
          validationStatus = validationResult.status;
          if (validationResult.status === 'pending') {
            needValidate = false;
            this.option('disabled', true);
            validationResult.complete.then(_ref3 => {
              let {
                status
              } = _ref3;
              this.option('disabled', false);
              validationStatus = status;
              validationStatus === 'valid' && submitInput.click();
              needValidate = true;
            });
          }
        }
      }
      validationStatus !== 'valid' && event.preventDefault();
      event.stopPropagation();
    });
  };
  _proto._initializeComponent = function _initializeComponent() {
    _Component.prototype._initializeComponent.call(this);
    this._addAction('onSubmit', this._getSubmitAction());
    this._clickAction = this._createClickAction();
  };
  _proto._initMarkup = function _initMarkup() {
    _Component.prototype._initMarkup.call(this);
    const $content = this.$element().find('.dx-button-content');
    const $template = $content.children().filter('.dx-template-wrapper');
    const $input = $content.children().filter('.dx-button-submit-input');
    if ($template.length) {
      $template.addClass('dx-button-content');
      $template.append($input);
      $content.replaceWith($template);
    }
  };
  _proto._patchOptionValues = function _patchOptionValues(options) {
    return _Component.prototype._patchOptionValues.call(this, _extends({}, options, {
      templateData: options._templateData
    }));
  };
  _proto._findGroup = function _findGroup() {
    const $element = this.$element();
    const validationGroup = this.option('validationGroup');
    return validationGroup !== undefined && validationGroup !== '' ? validationGroup : _validation_engine.default.findGroup($element, this._modelByElement($element));
  };
  _proto._createClickAction = function _createClickAction() {
    return this._createActionByOption('onClick', {
      excludeValidators: ['readOnly']
    });
  };
  _proto._optionChanged = function _optionChanged(option) {
    switch (option.name) {
      case 'onClick':
        this._clickAction = this._createClickAction();
        break;
      default:
        break;
    }
    _Component.prototype._optionChanged.call(this, option);
  };
  _createClass(ButtonWrapper, [{
    key: "_validationGroupConfig",
    get: function () {
      return _validation_engine.default.getGroupConfig(this._findGroup());
    }
  }, {
    key: "_templatesInfo",
    get: function () {
      return {
        template: 'content'
      };
    }
  }]);
  return ButtonWrapper;
}(_component.default);
module.exports = exports.default;
module.exports.default = exports.default;
