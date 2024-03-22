/**
* DevExtreme (cjs/renovation/ui/common/icon.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.IconProps = exports.Icon = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _icon = require("../../../core/utils/icon");
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["iconTemplate", "position", "source"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    iconClassName,
    props: {
      iconTemplate: IconTemplate,
      source
    },
    sourceType
  } = _ref;
  return (0, _inferno.createFragment)([sourceType === 'dxIcon' && (0, _inferno.createVNode)(1, "i", iconClassName), sourceType === 'fontIcon' && (0, _inferno.createVNode)(1, "i", iconClassName), sourceType === 'image' && (0, _inferno.createVNode)(1, "img", iconClassName, null, 1, {
    "alt": "",
    "src": source
  }), IconTemplate && (0, _inferno.createVNode)(1, "i", iconClassName, IconTemplate({}), 0)], 0);
};
exports.viewFunction = viewFunction;
const IconProps = exports.IconProps = {
  position: 'left',
  source: ''
};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let Icon = exports.Icon = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Icon, _BaseInfernoComponent);
  function Icon(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = Icon.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        iconTemplate: getTemplate(props.iconTemplate)
      }),
      sourceType: this.sourceType,
      cssClass: this.cssClass,
      iconClassName: this.iconClassName,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Icon, [{
    key: "sourceType",
    get: function () {
      return (0, _icon.getImageSourceType)(this.props.source);
    }
  }, {
    key: "cssClass",
    get: function () {
      return this.props.position !== 'left' ? 'dx-icon-right' : '';
    }
  }, {
    key: "iconClassName",
    get: function () {
      const generalClasses = {
        'dx-icon': true,
        [this.cssClass]: !!this.cssClass
      };
      const {
        source
      } = this.props;
      if (this.sourceType === 'dxIcon') {
        return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
          ["dx-icon-".concat(source)]: true
        }));
      }
      if (this.sourceType === 'fontIcon') {
        return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
          [String(source)]: !!source
        }));
      }
      if (this.sourceType === 'image') {
        return (0, _combine_classes.combineClasses)(generalClasses);
      }
      if (this.sourceType === 'svg') {
        return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
          'dx-svg-icon': true
        }));
      }
      return '';
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Icon;
}(_inferno2.BaseInfernoComponent);
Icon.defaultProps = IconProps;
