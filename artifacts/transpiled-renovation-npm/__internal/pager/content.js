"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagerContentDefaultProps = exports.PagerContent = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _accessibility = require("../../ui/shared/accessibility");
var _render_utils = require("../core/r1/utils/render_utils");
var _consts = require("./common/consts");
var _keyboard_action_context = require("./common/keyboard_action_context");
var _pager_props = require("./common/pager_props");
var _widget = require("./common/widget");
var _info = require("./info");
var _selector = require("./page_size/selector");
var _page_index_selector = require("./pages/page_index_selector");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const PagerContentDefaultProps = exports.PagerContentDefaultProps = _extends({}, _pager_props.PagerDefaultProps, {
  infoTextVisible: true,
  isLargeDisplayMode: true
});
class PagerContent extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    // eslint-disable-next-line max-len
    this.widgetElementRef = (0, _inferno.createRef)();
    // eslint-disable-next-line max-len
    this.widgetRootElementRef = (0, _inferno.createRef)();
    this.pagesRef = (0, _inferno.createRef)();
    this.infoTextRef = (0, _inferno.createRef)();
    this.__getterCache = {
      keyboardAction: undefined
    };
    this.state = {};
    this.__getterCache = {};
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.createFakeInstance = this.createFakeInstance.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, [])];
  }
  getChildContext() {
    return _extends({}, this.context, {
      [_keyboard_action_context.KeyboardActionContext.id]: this.getKeyboardAction() || _keyboard_action_context.KeyboardActionContext.defaultValue
    });
  }
  setRootElementRef() {
    const {
      rootElementRef
    } = this.props;
    if (rootElementRef && this.widgetRootElementRef) {
      rootElementRef.current = this.widgetRootElementRef.current;
    }
  }
  createFakeInstance() {
    return {
      option: () => false,
      element: () => {
        var _this$widgetRootEleme;
        return (_this$widgetRootEleme = this.widgetRootElementRef) === null || _this$widgetRootEleme === void 0 ? void 0 : _this$widgetRootEleme.current;
      },
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      _createActionByOption: () => e => {
        var _this$props$onKeyDown, _this$props;
        (_this$props$onKeyDown = (_this$props = this.props).onKeyDown) === null || _this$props$onKeyDown === void 0 || _this$props$onKeyDown.call(_this$props, e);
      }
    };
  }
  getKeyboardAction() {
    return {
      registerKeyboardAction: (element, action) => {
        const fakePagerInstance = this.createFakeInstance();
        return (0, _accessibility.registerKeyboardAction)('pager', fakePagerInstance, element, undefined, action);
      }
    };
  }
  getInfoVisible() {
    const {
      infoTextVisible,
      showInfo
    } = this.props;
    return !!showInfo && infoTextVisible;
  }
  getPageIndexSelectorVisible() {
    return this.props.pageSize !== 0;
  }
  getNormalizedDisplayMode() {
    const {
      displayMode,
      lightModeEnabled
    } = this.props;
    if (displayMode === 'adaptive' && lightModeEnabled !== undefined) {
      return lightModeEnabled ? 'compact' : 'full';
    }
    return displayMode ?? 'adaptive';
  }
  getPagesContainerVisible() {
    return !!this.props.pagesNavigatorVisible && this.props.pageCount > 0;
  }
  getPagesContainerVisibility() {
    if (this.props.pagesNavigatorVisible === 'auto' && this.props.pageCount === 1 && this.props.hasKnownLastPage) {
      return 'hidden';
    }
    return undefined;
  }
  getIsLargeDisplayMode() {
    const displayMode = this.getNormalizedDisplayMode();
    let result = false;
    if (displayMode === 'adaptive') {
      result = this.props.isLargeDisplayMode;
    } else {
      result = displayMode === 'full';
    }
    return result;
  }
  getClasses() {
    const classesMap = {
      [`${this.props.className}`]: !!this.props.className,
      [_consts.PAGER_CLASS]: true,
      [_consts.LIGHT_MODE_CLASS]: !this.getIsLargeDisplayMode()
    };
    return (0, _render_utils.combineClasses)(classesMap);
  }
  getAria() {
    return {
      role: 'navigation',
      label: this.props.label ?? ''
    };
  }
  componentWillUpdate(nextProps) {
    super.componentWillUpdate();
    if (this.props.onKeyDown !== nextProps.onKeyDown) {
      this.__getterCache.keyboardAction = undefined;
    }
  }
  render() {
    const {
      rtlEnabled,
      visible,
      showPageSizeSelector,
      allowedPageSizesRef,
      pageSize,
      pageSizeChangedInternal,
      allowedPageSizes,
      infoTextRef,
      infoText,
      pageCount,
      pageIndex,
      totalCount,
      pagesRef,
      hasKnownLastPage,
      maxPagesCount,
      pageIndexChangedInternal,
      pagesCountText,
      showNavigationButtons,
      style,
      width,
      height,
      elementAttr,
      hint,
      disabled,
      tabIndex,
      accessKey,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    } = this.props;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
      "rootElementRef": this.widgetRootElementRef,
      "rtlEnabled": rtlEnabled,
      "classes": this.getClasses(),
      "visible": visible,
      "aria": this.getAria(),
      "style": style,
      "width": width,
      "height": height,
      "hint": hint,
      "disabled": disabled,
      "tabIndex": tabIndex,
      "accessKey": accessKey,
      "activeStateEnabled": activeStateEnabled,
      "focusStateEnabled": focusStateEnabled,
      "hoverStateEnabled": hoverStateEnabled
    }, elementAttr, {
      children: [showPageSizeSelector && (0, _inferno.createComponentVNode)(2, _selector.PageSizeSelector, {
        "rootElementRef": allowedPageSizesRef,
        "isLargeDisplayMode": this.getIsLargeDisplayMode(),
        "pageSize": pageSize,
        "pageSizeChangedInternal": pageSizeChangedInternal,
        "allowedPageSizes": allowedPageSizes
      }), this.getPagesContainerVisible() && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGES_CLASS, [this.getInfoVisible() && (0, _inferno.createComponentVNode)(2, _info.InfoText, {
        "rootElementRef": infoTextRef,
        "infoText": infoText,
        "pageCount": pageCount,
        "pageIndex": pageIndex,
        "totalCount": totalCount
      }), this.getPageIndexSelectorVisible() && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_INDEXES_CLASS, (0, _inferno.createComponentVNode)(2, _page_index_selector.PageIndexSelector, {
        "hasKnownLastPage": hasKnownLastPage,
        "isLargeDisplayMode": this.getIsLargeDisplayMode(),
        "maxPagesCount": maxPagesCount,
        "pageCount": pageCount,
        "pageIndex": pageIndex,
        "pageIndexChangedInternal": pageIndexChangedInternal,
        "pagesCountText": pagesCountText,
        "showNavigationButtons": showNavigationButtons,
        "totalCount": totalCount
      }), 2, null, null, pagesRef)], 0, {
        "style": {
          visibility: this.getPagesContainerVisibility()
        }
      })]
    })));
  }
}
exports.PagerContent = PagerContent;
PagerContent.defaultProps = PagerContentDefaultProps;