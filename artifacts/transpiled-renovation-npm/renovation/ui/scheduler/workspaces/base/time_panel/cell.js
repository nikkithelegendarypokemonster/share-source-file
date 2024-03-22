"use strict";

exports.viewFunction = exports.TimePanelCellProps = exports.TimePanelCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _cell = require("../cell");
const _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplateProps", "endDate", "groupIndex", "groups", "highlighted", "index", "isFirstGroupCell", "isLastGroupCell", "startDate", "text", "timeCellTemplate"];
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
    props: {
      className,
      highlighted,
      isFirstGroupCell,
      isLastGroupCell,
      text,
      timeCellTemplate: TimeCellTemplate
    },
    timeCellTemplateProps
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _cell.CellBase, {
    "isFirstGroupCell": isFirstGroupCell,
    "isLastGroupCell": isLastGroupCell,
    "className": "dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ".concat(highlighted ? 'dx-scheduler-time-panel-current-time-cell' : '', " ").concat(className),
    children: [!TimeCellTemplate && (0, _inferno.createVNode)(1, "div", null, text, 0), !!TimeCellTemplate && TimeCellTemplate({
      index: timeCellTemplateProps.index,
      data: timeCellTemplateProps.data
    })]
  });
};
exports.viewFunction = viewFunction;
const TimePanelCellProps = exports.TimePanelCellProps = _cell.CellBaseProps;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let TimePanelCell = exports.TimePanelCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(TimePanelCell, _BaseInfernoComponent);
  function TimePanelCell(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = TimePanelCell.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['groupIndex'] !== nextProps['groupIndex'] || this.props['groups'] !== nextProps['groups'] || this.props['index'] !== nextProps['index'] || this.props['startDate'] !== nextProps['startDate'] || this.props['text'] !== nextProps['text']) {
      this.__getterCache['timeCellTemplateProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        timeCellTemplate: getTemplate(props.timeCellTemplate)
      }),
      timeCellTemplateProps: this.timeCellTemplateProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(TimePanelCell, [{
    key: "timeCellTemplateProps",
    get: function () {
      if (this.__getterCache['timeCellTemplateProps'] !== undefined) {
        return this.__getterCache['timeCellTemplateProps'];
      }
      return this.__getterCache['timeCellTemplateProps'] = (() => {
        const {
          groupIndex,
          groups,
          index,
          startDate,
          text
        } = this.props;
        return {
          data: {
            date: startDate,
            groups,
            groupIndex,
            text
          },
          index
        };
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return TimePanelCell;
}(_inferno2.BaseInfernoComponent);
TimePanelCell.defaultProps = TimePanelCellProps;