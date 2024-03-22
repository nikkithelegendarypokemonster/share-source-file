import { isDefined } from '../../../../core/utils/type';
import { hasWindow } from '../../../../core/utils/window';
import messageLocalization from '../../../../localization/message';
import Pager from '../../../../ui/pager';
import modules from '../m_modules';
var PAGER_CLASS = 'pager';
var MAX_PAGES_COUNT = 10;
var getPageIndex = function getPageIndex(dataController) {
  // eslint-disable-next-line radix
  return 1 + (parseInt(dataController.pageIndex()) || 0);
};
// TODO getController
export class PagerView extends modules.View {
  init() {
    var dataController = this.getController('data');
    dataController.changed.add(e => {
      if (e && e.repaintChangesOnly) {
        var pager = this._pager;
        if (pager) {
          pager.option({
            pageIndex: getPageIndex(dataController),
            pageSize: dataController.pageSize(),
            pageCount: dataController.pageCount(),
            totalCount: dataController.totalCount(),
            hasKnownLastPage: dataController.hasKnownLastPage()
          });
        } else {
          this.render();
        }
      } else if (!e || e.changeType !== 'update' && e.changeType !== 'updateSelection' && e.changeType !== 'updateFocusedRow') {
        this._pager = null;
        this.render();
      }
    });
  }
  dispose() {
    this._pager = null;
  }
  optionChanged(args) {
    var {
      name
    } = args;
    var isPager = name === 'pager';
    var isPaging = name === 'paging';
    var isDataSource = name === 'dataSource';
    var isScrolling = name === 'scrolling';
    var dataController = this.getController('data');
    if (isPager || isPaging || isScrolling || isDataSource) {
      args.handled = true;
      if (dataController.skipProcessingPagingChange(args.fullName)) {
        return;
      }
      if (isPager || isPaging) {
        this._pageSizes = null;
      }
      if (!isDataSource) {
        this._pager = null;
        this._invalidate();
        if (hasWindow() && isPager && this.component) {
          // @ts-expect-error
          this.component.resize();
        }
      }
    }
  }
  _renderCore() {
    var _a;
    var that = this;
    var $element = that.element().addClass(that.addWidgetPrefix(PAGER_CLASS));
    var pagerOptions = (_a = that.option('pager')) !== null && _a !== void 0 ? _a : {};
    var dataController = that.getController('data');
    var keyboardController = that.getController('keyboardNavigation');
    var options = {
      maxPagesCount: MAX_PAGES_COUNT,
      pageIndex: getPageIndex(dataController),
      pageCount: dataController.pageCount(),
      pageSize: dataController.pageSize(),
      showPageSizes: pagerOptions.showPageSizeSelector,
      showInfo: pagerOptions.showInfo,
      displayMode: pagerOptions.displayMode,
      pagesNavigatorVisible: pagerOptions.visible,
      showNavigationButtons: pagerOptions.showNavigationButtons,
      label: pagerOptions.label,
      pageSizes: that.getPageSizes(),
      totalCount: dataController.totalCount(),
      hasKnownLastPage: dataController.hasKnownLastPage(),
      pageIndexChanged(pageIndex) {
        if (dataController.pageIndex() !== pageIndex - 1) {
          dataController.pageIndex(pageIndex - 1);
        }
      },
      pageSizeChanged(pageSize) {
        dataController.pageSize(pageSize);
      },
      onKeyDown: e => keyboardController && keyboardController.executeAction('onKeyDown', e),
      useLegacyKeyboardNavigation: this.option('useLegacyKeyboardNavigation'),
      useKeyboard: this.option('keyboardNavigation.enabled')
    };
    if (isDefined(pagerOptions.infoText)) {
      options.infoText = pagerOptions.infoText;
    }
    if (this._pager) {
      this._pager.repaint();
      return;
    }
    if (hasWindow()) {
      this._pager = that._createComponent($element, Pager, options);
    } else {
      $element.addClass('dx-pager').html('<div class="dx-pages"><div class="dx-page"></div></div>');
    }
  }
  getPager() {
    return this._pager;
  }
  getPageSizes() {
    var that = this;
    var dataController = that.getController('data');
    var pagerOptions = that.option('pager');
    var allowedPageSizes = pagerOptions && pagerOptions.allowedPageSizes;
    var pageSize = dataController.pageSize();
    if (!isDefined(that._pageSizes) || !that._pageSizes.includes(pageSize)) {
      that._pageSizes = [];
      if (pagerOptions) {
        if (Array.isArray(allowedPageSizes)) {
          that._pageSizes = allowedPageSizes;
        } else if (allowedPageSizes && pageSize > 1) {
          that._pageSizes = [Math.floor(pageSize / 2), pageSize, pageSize * 2];
        }
      }
    }
    return that._pageSizes;
  }
  isVisible() {
    var dataController = this.getController('data');
    var pagerOptions = this.option('pager');
    var pagerVisible = pagerOptions && pagerOptions.visible;
    var scrolling = this.option('scrolling');
    if (pagerVisible === 'auto') {
      // @ts-expect-error
      if (scrolling && (scrolling.mode === 'virtual' || scrolling.mode === 'infinite')) {
        pagerVisible = false;
      } else {
        pagerVisible = dataController.pageCount() > 1 || dataController.isLoaded() && !dataController.hasKnownLastPage();
      }
    }
    return !!pagerVisible;
  }
  getHeight() {
    return this.getElementHeight();
  }
}
export var pagerModule = {
  defaultOptions() {
    return {
      pager: {
        visible: 'auto',
        showPageSizeSelector: false,
        allowedPageSizes: 'auto',
        label: messageLocalization.format('dxPager-ariaLabel')
      }
    };
  },
  views: {
    pagerView: PagerView
  }
};