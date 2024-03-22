"use strict";

exports.viewFunction = exports.HorizontalGroupPanelLayoutProps = exports.GroupPanelHorizontalLayout = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _row = require("./row");
var _group_panel_layout_props = require("../group_panel_layout_props");
const _excluded = ["className", "elementRef", "groupByDate", "groupPanelData", "height", "resourceCellTemplate", "styles"];
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
    groupPanelItems,
    props: {
      resourceCellTemplate
    }
  } = _ref;
  return (0, _inferno.createFragment)(groupPanelItems.map(group => (0, _inferno.createComponentVNode)(2, _row.Row, {
    "groupItems": group,
    "cellTemplate": resourceCellTemplate
  }, group[0].key)), 0);
};
exports.viewFunction = viewFunction;
const HorizontalGroupPanelLayoutProps = exports.HorizontalGroupPanelLayoutProps = _group_panel_layout_props.GroupPanelLayoutProps;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let GroupPanelHorizontalLayout = exports.GroupPanelHorizontalLayout = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelHorizontalLayout, _BaseInfernoComponent);
  function GroupPanelHorizontalLayout(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = GroupPanelHorizontalLayout.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['groupPanelData'] !== nextProps['groupPanelData']) {
      this.__getterCache['groupPanelItems'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      groupPanelItems: this.groupPanelItems,
      restAttributes: this.restAttributes
    });
  };
  _createClass(GroupPanelHorizontalLayout, [{
    key: "groupPanelItems",
    get: function () {
      if (this.__getterCache['groupPanelItems'] !== undefined) {
        return this.__getterCache['groupPanelItems'];
      }
      return this.__getterCache['groupPanelItems'] = (() => {
        const {
          groupPanelData
        } = this.props;
        const {
          baseColSpan,
          groupPanelItems
        } = groupPanelData;
        const colSpans = groupPanelItems.reduceRight((currentColSpans, groupsRow, index) => {
          const nextColSpans = currentColSpans;
          const currentLevelGroupCount = groupsRow.length;
          const previousColSpan = index === groupPanelItems.length - 1 ? baseColSpan : currentColSpans[index + 1];
          const previousLevelGroupCount = index === groupPanelItems.length - 1 ? currentLevelGroupCount : groupPanelItems[index + 1].length;
          const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;
          nextColSpans[index] = groupCountDiff * previousColSpan;
          return nextColSpans;
        }, [...new Array(groupPanelItems.length)]);
        return groupPanelItems.map((groupsRenderRow, index) => {
          const colSpan = colSpans[index];
          return groupsRenderRow.map(groupItem => _extends({}, groupItem, {
            colSpan
          }));
        });
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
  return GroupPanelHorizontalLayout;
}(_inferno2.BaseInfernoComponent);
GroupPanelHorizontalLayout.defaultProps = HorizontalGroupPanelLayoutProps;