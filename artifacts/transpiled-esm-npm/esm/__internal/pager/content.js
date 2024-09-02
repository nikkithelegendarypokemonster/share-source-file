import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
import { registerKeyboardAction } from '../../ui/shared/accessibility';
import { combineClasses } from '../core/r1/utils/render_utils';
import { LIGHT_MODE_CLASS, PAGER_CLASS, PAGER_PAGE_INDEXES_CLASS, PAGER_PAGES_CLASS } from './common/consts';
import { KeyboardActionContext } from './common/keyboard_action_context';
import { PagerDefaultProps } from './common/pager_props';
import { Widget } from './common/widget';
import { InfoText } from './info';
import { PageSizeSelector } from './page_size/selector';
import { PageIndexSelector } from './pages/page_index_selector';
export const PagerContentDefaultProps = _extends({}, PagerDefaultProps, {
  infoTextVisible: true,
  isLargeDisplayMode: true
});
export class PagerContent extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    // eslint-disable-next-line max-len
    this.widgetElementRef = infernoCreateRef();
    // eslint-disable-next-line max-len
    this.widgetRootElementRef = infernoCreateRef();
    this.pagesRef = infernoCreateRef();
    this.infoTextRef = infernoCreateRef();
    this.__getterCache = {
      keyboardAction: undefined
    };
    this.state = {};
    this.__getterCache = {};
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.createFakeInstance = this.createFakeInstance.bind(this);
  }
  createEffects() {
    return [new InfernoEffect(this.setRootElementRef, [])];
  }
  getChildContext() {
    return _extends({}, this.context, {
      [KeyboardActionContext.id]: this.getKeyboardAction() || KeyboardActionContext.defaultValue
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
        return registerKeyboardAction('pager', fakePagerInstance, element, undefined, action);
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
      [PAGER_CLASS]: true,
      [LIGHT_MODE_CLASS]: !this.getIsLargeDisplayMode()
    };
    return combineClasses(classesMap);
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
      showPageSizes,
      pageSizesRef,
      pageSize,
      pageSizeChangedInternal,
      pageSizes,
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
      style
    } = this.props;
    return normalizeProps(createComponentVNode(2, Widget, _extends({
      "rootElementRef": this.widgetRootElementRef,
      "rtlEnabled": rtlEnabled,
      "classes": this.getClasses(),
      "visible": visible,
      "aria": this.getAria()
    }, style, {
      children: [showPageSizes && createComponentVNode(2, PageSizeSelector, {
        "rootElementRef": pageSizesRef,
        "isLargeDisplayMode": this.getIsLargeDisplayMode(),
        "pageSize": pageSize,
        "pageSizeChangedInternal": pageSizeChangedInternal,
        "pageSizes": pageSizes
      }), this.getPagesContainerVisible() && createVNode(1, "div", PAGER_PAGES_CLASS, [this.getInfoVisible() && createComponentVNode(2, InfoText, {
        "rootElementRef": infoTextRef,
        "infoText": infoText,
        "pageCount": pageCount,
        "pageIndex": pageIndex,
        "totalCount": totalCount
      }), this.getPageIndexSelectorVisible() && createVNode(1, "div", PAGER_PAGE_INDEXES_CLASS, createComponentVNode(2, PageIndexSelector, {
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
PagerContent.defaultProps = PagerContentDefaultProps;