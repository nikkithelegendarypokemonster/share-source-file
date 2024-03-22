import _extends from "@babel/runtime/helpers/esm/extends";
import { getHeight, getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import Action from '../core/action';
import devices from '../core/devices';
import config from '../core/config';
import Guid from '../core/guid';
import { resetActiveElement } from '../core/utils/dom';
import { Deferred } from '../core/utils/deferred';
import { isPlainObject } from '../core/utils/type';
import { extend } from '../core/utils/extend';
import { getWindow } from '../core/utils/window';
import eventsEngine from '../events/core/events_engine';
import { value as getViewport } from '../core/utils/view_port';
import { isFluent } from './themes';
import messageLocalization from '../localization/message';
import errors from './widget/ui.errors';
import Popup from './popup/ui.popup';
import { ensureDefined } from '../core/utils/common';
var window = getWindow();
var DEFAULT_BUTTON = {
  text: 'OK',
  onClick: function onClick() {
    return true;
  }
};

/**
 * @name ui.dialog
 */

var DX_DIALOG_CLASSNAME = 'dx-dialog';
var DX_DIALOG_WRAPPER_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-wrapper");
var DX_DIALOG_ROOT_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-root");
var DX_DIALOG_CONTENT_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-content");
var DX_DIALOG_MESSAGE_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-message");
var DX_DIALOG_BUTTONS_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-buttons");
var DX_DIALOG_BUTTON_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-button");
var DX_BUTTON_CLASSNAME = 'dx-button';
var getApplyButtonConfig = () => {
  if (isFluent()) {
    return {
      stylingMode: 'contained',
      type: 'default'
    };
  }
  return {};
};
var getCancelButtonConfig = () => {
  if (isFluent()) {
    return {
      stylingMode: 'outlined',
      type: 'default'
    };
  }
  return {};
};
export var custom = function custom(options) {
  var _options$title;
  var deferred = new Deferred();
  options = options || {};
  var $element = $('<div>').addClass(DX_DIALOG_CLASSNAME).appendTo(getViewport());
  var isMessageDefined = ('message' in options);
  var isMessageHtmlDefined = ('messageHtml' in options);
  if (isMessageDefined) {
    errors.log('W1013');
  }
  var messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);
  var messageId = options.title ? null : new Guid();
  var $message = $('<div>').addClass(DX_DIALOG_MESSAGE_CLASSNAME).html(messageHtml).attr('id', messageId);
  var popupToolbarItems = [];
  var popupInstance = new Popup($element, extend({
    title: (_options$title = options.title) !== null && _options$title !== void 0 ? _options$title : '',
    showTitle: ensureDefined(options.showTitle, true),
    dragEnabled: ensureDefined(options.dragEnabled, true),
    height: 'auto',
    width: options.width,
    showCloseButton: options.showCloseButton || false,
    ignoreChildEvents: false,
    container: $element,
    visualContainer: window,
    dragAndResizeArea: window,
    onContentReady: function onContentReady(args) {
      args.component.$content().addClass(DX_DIALOG_CONTENT_CLASSNAME).append($message);
      if (messageId) {
        args.component.$overlayContent().attr('aria-labelledby', messageId);
      }
    },
    onShowing: function onShowing(e) {
      e.component.bottomToolbar().addClass(DX_DIALOG_BUTTONS_CLASSNAME).find(".".concat(DX_BUTTON_CLASSNAME)).addClass(DX_DIALOG_BUTTON_CLASSNAME);
      resetActiveElement();
    },
    onShown: function onShown(e) {
      var $firstButton = e.component.bottomToolbar().find(".".concat(DX_BUTTON_CLASSNAME)).first();
      eventsEngine.trigger($firstButton, 'focus');
    },
    onHiding: function onHiding() {
      deferred.reject();
    },
    onHidden: function onHidden(_ref) {
      var {
        element
      } = _ref;
      $(element).remove();
    },
    animation: {
      show: {
        type: 'pop',
        duration: 400
      },
      hide: {
        type: 'pop',
        duration: 400,
        to: {
          opacity: 0,
          scale: 0
        },
        from: {
          opacity: 1,
          scale: 1
        }
      }
    },
    rtlEnabled: config().rtlEnabled,
    position: {
      boundaryOffset: {
        h: 10,
        v: 0
      }
    }
  }, options.popupOptions));
  var buttonOptions = options.buttons || [DEFAULT_BUTTON];
  buttonOptions.forEach(options => {
    var action = new Action(options.onClick, {
      context: popupInstance
    });
    popupToolbarItems.push({
      toolbar: 'bottom',
      location: devices.current().android ? 'after' : 'center',
      widget: 'dxButton',
      options: _extends({}, options, {
        onClick: function onClick() {
          var result = action.execute(...arguments);
          hide(result);
        }
      })
    });
  });
  popupInstance.option('toolbarItems', popupToolbarItems);
  popupInstance.$wrapper().addClass(DX_DIALOG_WRAPPER_CLASSNAME);
  if (options.position) {
    popupInstance.option('position', options.position);
  }
  popupInstance.$wrapper().addClass(DX_DIALOG_ROOT_CLASSNAME);
  function show() {
    if (devices.real().deviceType === 'phone') {
      var isPortrait = getHeight(window) > getWidth(window);
      var width = isPortrait ? '90%' : '60%';
      popupInstance.option({
        width
      });
    }
    popupInstance.show();
    return deferred.promise();
  }
  function hide(value) {
    deferred.resolve(value);
    popupInstance.hide();
  }
  return {
    show: show,
    hide: hide
  };
};
export var alert = function alert(messageHtml) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var showTitle = arguments.length > 2 ? arguments[2] : undefined;
  var options = isPlainObject(messageHtml) ? messageHtml : {
    title,
    messageHtml,
    showTitle,
    buttons: [_extends({}, DEFAULT_BUTTON, getApplyButtonConfig())],
    dragEnabled: showTitle
  };
  return custom(options).show();
};
export var confirm = function confirm(messageHtml) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var showTitle = arguments.length > 2 ? arguments[2] : undefined;
  var options = isPlainObject(messageHtml) ? messageHtml : {
    title,
    messageHtml,
    showTitle,
    buttons: [_extends({
      text: messageLocalization.format('Yes'),
      onClick: function onClick() {
        return true;
      }
    }, getApplyButtonConfig()), _extends({
      text: messageLocalization.format('No'),
      onClick: function onClick() {
        return false;
      }
    }, getCancelButtonConfig())],
    dragEnabled: showTitle
  };
  return custom(options).show();
};