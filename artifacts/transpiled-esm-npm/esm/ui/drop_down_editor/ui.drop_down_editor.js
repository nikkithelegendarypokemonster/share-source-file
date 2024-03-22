import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { noop, splitPair } from '../../core/utils/common';
import { focused } from '../widget/selectors';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getPublicElement } from '../../core/element';
import errors from '../widget/ui.errors';
import animationPosition from '../../animation/position';
import { getDefaultAlignment } from '../../core/utils/position';
import DropDownButton from './ui.drop_down_button';
import Widget from '../widget/ui.widget';
import messageLocalization from '../../localization/message';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '../../events/utils/index';
import TextBox from '../text_box';
import { name as clickEventName } from '../../events/click';
import devices from '../../core/devices';
import { FunctionTemplate } from '../../core/templates/function_template';
import Popup from '../popup/ui.popup';
import { hasWindow } from '../../core/utils/window';
import { getElementWidth, getSizeValue } from './utils';
import { locate, move } from '../../animation/translator';
var DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
var DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
var DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
var DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
var DROP_DOWN_EDITOR_OVERLAY_FLIPPED = 'dx-dropdowneditor-overlay-flipped';
var DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
var DROP_DOWN_EDITOR_FIELD_CLICKABLE = 'dx-dropdowneditor-field-clickable';
var DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';
var OVERLAY_CONTENT_LABEL = 'Dropdown';
var isIOs = devices.current().platform === 'ios';
var DropDownEditor = TextBox.inherit({
  _supportedKeys: function _supportedKeys() {
    return extend({}, this.callBase(), {
      tab: function tab(e) {
        if (!this.option('opened')) {
          return;
        }
        if (!this._popup.getFocusableElements().length) {
          this.close();
          return;
        }
        var $focusableElement = e.shiftKey ? this._getLastPopupElement() : this._getFirstPopupElement();
        if ($focusableElement) {
          eventsEngine.trigger($focusableElement, 'focus');
          $focusableElement.select();
        }
        e.preventDefault();
      },
      escape: function escape(e) {
        if (this.option('opened')) {
          e.preventDefault();
        }
        this.close();
        return true;
      },
      upArrow: function upArrow(e) {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.altKey) {
            this.close();
            return false;
          }
        }
        return true;
      },
      downArrow: function downArrow(e) {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.altKey) {
            this._validatedOpening();
            return false;
          }
        }
        return true;
      },
      enter: function enter(e) {
        if (this.option('opened')) {
          e.preventDefault();
          this._valueChangeEventHandler(e);
        }
        return true;
      }
    });
  },
  _getDefaultButtons: function _getDefaultButtons() {
    return this.callBase().concat([{
      name: 'dropDown',
      Ctor: DropDownButton
    }]);
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      value: null,
      onOpened: null,
      onClosed: null,
      opened: false,
      acceptCustomValue: true,
      applyValueMode: 'instantly',
      deferRendering: true,
      activeStateEnabled: true,
      dropDownButtonTemplate: 'dropDownButton',
      fieldTemplate: null,
      openOnFieldClick: false,
      showDropDownButton: true,
      buttons: void 0,
      dropDownOptions: {
        showTitle: false
      },
      popupPosition: this._getDefaultPopupPosition(),
      onPopupInitialized: null,
      applyButtonText: messageLocalization.format('OK'),
      cancelButtonText: messageLocalization.format('Cancel'),
      buttonsLocation: 'default',
      useHiddenSubmitElement: false,
      validationMessagePosition: 'auto'

      /**
      * @name dxDropDownEditorOptions.mask
      * @hidden
      */

      /**
      * @name dxDropDownEditorOptions.maskChar
      * @hidden
      */

      /**
      * @name dxDropDownEditorOptions.maskRules
      * @hidden
      */

      /**
      * @name dxDropDownEditorOptions.maskInvalidMessage
      * @hidden
      */

      /**
      * @name dxDropDownEditorOptions.useMaskedValue
      * @hidden
      */

      /**
      * @name dxDropDownEditorOptions.mode
      * @hidden
      */

      /**
       * @name dxDropDownEditorOptions.showMaskMode
       * @hidden
       */
    });
  },
  _useTemplates: function _useTemplates() {
    return true;
  },
  _getDefaultPopupPosition: function _getDefaultPopupPosition(isRtlEnabled) {
    var position = getDefaultAlignment(isRtlEnabled);
    return {
      offset: {
        h: 0,
        v: -1
      },
      my: position + ' top',
      at: position + ' bottom',
      collision: 'flip flip'
    };
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device(_device) {
        var isGeneric = _device.platform === 'generic';
        return isGeneric;
      },
      options: {
        popupPosition: {
          offset: {
            v: 0
          }
        }
      }
    }]);
  },
  _inputWrapper: function _inputWrapper() {
    return this.$element().find('.' + DROP_DOWN_EDITOR_INPUT_WRAPPER).first();
  },
  _init: function _init() {
    this.callBase();
    this._initVisibilityActions();
    this._initPopupInitializedAction();
    this._updatePopupPosition(this.option('rtlEnabled'));
    this._options.cache('dropDownOptions', this.option('dropDownOptions'));
  },
  _updatePopupPosition: function _updatePopupPosition(isRtlEnabled) {
    var {
      my,
      at
    } = this._getDefaultPopupPosition(isRtlEnabled);
    var currentPosition = this.option('popupPosition');
    this.option('popupPosition', extend({}, currentPosition, {
      my,
      at
    }));
  },
  _initVisibilityActions: function _initVisibilityActions() {
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initPopupInitializedAction: function _initPopupInitializedAction() {
    this._popupInitializedAction = this._createActionByOption('onPopupInitialized', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initMarkup: function _initMarkup() {
    this._renderSubmitElement();
    this.callBase();
    this.$element().addClass(DROP_DOWN_EDITOR_CLASS);
    this.setAria('role', 'combobox');
  },
  _render: function _render() {
    this.callBase();
    this._renderOpenHandler();
    this._attachFocusOutHandler();
    this._renderOpenedState();
  },
  _renderContentImpl: function _renderContentImpl() {
    if (!this.option('deferRendering')) {
      this._createPopup();
    }
  },
  _renderInput: function _renderInput() {
    this.callBase();
    this._wrapInput();
    this._setDefaultAria();
  },
  _wrapInput: function _wrapInput() {
    this._$container = this.$element().wrapInner($('<div>').addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER)).children().eq(0);
  },
  _getAriaHasPopup() {
    return 'true';
  },
  _getAriaAutocomplete() {
    return 'none';
  },
  _setDefaultAria: function _setDefaultAria() {
    this.setAria({
      'haspopup': this._getAriaHasPopup(),
      'autocomplete': this._getAriaAutocomplete()
    });
  },
  _readOnlyPropValue: function _readOnlyPropValue() {
    return !this._isEditable() || this.callBase();
  },
  _cleanFocusState: function _cleanFocusState() {
    this.callBase();
    if (this.option('fieldTemplate')) {
      this._detachFocusEvents();
    }
  },
  _getFieldTemplate: function _getFieldTemplate() {
    return this.option('fieldTemplate') && this._getTemplateByOption('fieldTemplate');
  },
  _renderMask: function _renderMask() {
    if (this.option('fieldTemplate')) {
      return;
    }
    this.callBase();
  },
  _renderField: function _renderField() {
    var fieldTemplate = this._getFieldTemplate();
    fieldTemplate && this._renderTemplatedField(fieldTemplate, this._fieldRenderData());
  },
  _renderPlaceholder: function _renderPlaceholder() {
    var hasFieldTemplate = !!this._getFieldTemplate();
    if (!hasFieldTemplate) {
      this.callBase();
    }
  },
  _renderValue: function _renderValue() {
    if (this.option('useHiddenSubmitElement')) {
      this._setSubmitValue();
    }
    var promise = this.callBase();
    promise.always(this._renderField.bind(this));
  },
  _renderTemplatedField: function _renderTemplatedField(fieldTemplate, data) {
    var isFocused = focused(this._input());
    var $container = this._$container;
    this._detachKeyboardEvents();
    this._refreshButtonsContainer();
    this._detachWrapperContent();
    this._detachFocusEvents();
    $container.empty();
    var $templateWrapper = $('<div>').addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER).appendTo($container);
    fieldTemplate.render({
      model: data,
      container: getPublicElement($templateWrapper),
      onRendered: () => {
        var isRenderedInRoot = !!this.$element().find($templateWrapper).length;
        if (!isRenderedInRoot) {
          return;
        }
        var $input = this._input();
        if (!$input.length) {
          throw errors.Error('E1010');
        }
        this._integrateInput();
        isFocused && eventsEngine.trigger($input, 'focus');
      }
    });
    this._attachWrapperContent($container);
  },
  _detachWrapperContent() {
    var _this$_$submitElement, _this$_$beforeButtons, _this$_$afterButtonsC;
    var useHiddenSubmitElement = this.option('useHiddenSubmitElement');
    useHiddenSubmitElement && ((_this$_$submitElement = this._$submitElement) === null || _this$_$submitElement === void 0 ? void 0 : _this$_$submitElement.detach());

    // NOTE: to prevent buttons disposition
    var beforeButtonsContainerParent = (_this$_$beforeButtons = this._$beforeButtonsContainer) === null || _this$_$beforeButtons === void 0 ? void 0 : _this$_$beforeButtons[0].parentNode;
    var afterButtonsContainerParent = (_this$_$afterButtonsC = this._$afterButtonsContainer) === null || _this$_$afterButtonsC === void 0 ? void 0 : _this$_$afterButtonsC[0].parentNode;
    beforeButtonsContainerParent === null || beforeButtonsContainerParent === void 0 ? void 0 : beforeButtonsContainerParent.removeChild(this._$beforeButtonsContainer[0]);
    afterButtonsContainerParent === null || afterButtonsContainerParent === void 0 ? void 0 : afterButtonsContainerParent.removeChild(this._$afterButtonsContainer[0]);
  },
  _attachWrapperContent($container) {
    var _this$_$submitElement2;
    var useHiddenSubmitElement = this.option('useHiddenSubmitElement');
    $container.prepend(this._$beforeButtonsContainer);
    useHiddenSubmitElement && ((_this$_$submitElement2 = this._$submitElement) === null || _this$_$submitElement2 === void 0 ? void 0 : _this$_$submitElement2.appendTo($container));
    $container.append(this._$afterButtonsContainer);
  },
  _refreshButtonsContainer() {
    this._$buttonsContainer = this.$element().children().eq(0);
  },
  _integrateInput: function _integrateInput() {
    this._renderFocusState();
    this._refreshValueChangeEvent();
    this._refreshEvents();
    this._refreshEmptinessEvent();
  },
  _refreshEmptinessEvent: function _refreshEmptinessEvent() {
    eventsEngine.off(this._input(), 'input blur', this._toggleEmptinessEventHandler);
    this._renderEmptinessEvent();
  },
  _fieldRenderData: function _fieldRenderData() {
    return this.option('value');
  },
  _initTemplates: function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      dropDownButton: new FunctionTemplate(function (options) {
        var $icon = $('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        $(options.container).append($icon);
      })
    });
    this.callBase();
  },
  _renderOpenHandler: function _renderOpenHandler() {
    var $inputWrapper = this._inputWrapper();
    var eventName = addNamespace(clickEventName, this.NAME);
    var openOnFieldClick = this.option('openOnFieldClick');
    eventsEngine.off($inputWrapper, eventName);
    eventsEngine.on($inputWrapper, eventName, this._getInputClickHandler(openOnFieldClick));
    this.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);
    if (openOnFieldClick) {
      this._openOnFieldClickAction = this._createAction(this._openHandler.bind(this));
    }
  },
  _attachFocusOutHandler: function _attachFocusOutHandler() {
    if (isIOs) {
      this._detachFocusOutEvents();
      eventsEngine.on(this._inputWrapper(), addNamespace('focusout', this.NAME), event => {
        var newTarget = event.relatedTarget;
        if (newTarget && this.option('opened')) {
          var isNewTargetOutside = this._isTargetOutOfComponent(newTarget);
          if (isNewTargetOutside) {
            this.close();
          }
        }
      });
    }
  },
  _isTargetOutOfComponent: function _isTargetOutOfComponent(newTarget) {
    var popupWrapper = this.content ? $(this.content()).closest(".".concat(DROP_DOWN_EDITOR_OVERLAY)) : this._$popup;
    var isTargetOutsidePopup = $(newTarget).closest(".".concat(DROP_DOWN_EDITOR_OVERLAY), popupWrapper).length === 0;
    return isTargetOutsidePopup;
  },
  _detachFocusOutEvents: function _detachFocusOutEvents() {
    isIOs && eventsEngine.off(this._inputWrapper(), addNamespace('focusout', this.NAME));
  },
  _getInputClickHandler: function _getInputClickHandler(openOnFieldClick) {
    return openOnFieldClick ? e => {
      this._executeOpenAction(e);
    } : e => {
      this._focusInput();
    };
  },
  _openHandler: function _openHandler() {
    this._toggleOpenState();
  },
  _executeOpenAction: function _executeOpenAction(e) {
    this._openOnFieldClickAction({
      event: e
    });
  },
  _keyboardEventBindingTarget: function _keyboardEventBindingTarget() {
    return this._input();
  },
  _focusInput: function _focusInput() {
    if (this.option('disabled')) {
      return false;
    }
    if (this.option('focusStateEnabled') && !focused(this._input())) {
      this._resetCaretPosition();
      eventsEngine.trigger(this._input(), 'focus');
    }
    return true;
  },
  _resetCaretPosition: function _resetCaretPosition() {
    var ignoreEditable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var inputElement = this._input().get(0);
    if (inputElement) {
      var {
        value
      } = inputElement;
      var caretPosition = isDefined(value) && (ignoreEditable || this._isEditable()) ? value.length : 0;
      this._caret({
        start: caretPosition,
        end: caretPosition
      }, true);
    }
  },
  _isEditable: function _isEditable() {
    return this.option('acceptCustomValue');
  },
  _toggleOpenState: function _toggleOpenState(isVisible) {
    if (!this._focusInput()) {
      return;
    }
    if (!this.option('readOnly')) {
      isVisible = arguments.length ? isVisible : !this.option('opened');
      this.option('opened', isVisible);
    }
  },
  _getControlsAria() {
    return this._popup && this._popupContentId;
  },
  _renderOpenedState: function _renderOpenedState() {
    var opened = this.option('opened');
    if (opened) {
      this._createPopup();
    }
    this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
    this._setPopupOption('visible', opened);
    var arias = {
      'expanded': opened,
      'controls': this._getControlsAria()
    };
    this.setAria(arias);
    this.setAria('owns', (opened || undefined) && this._popupContentId, this.$element());
  },
  _createPopup: function _createPopup() {
    if (this._$popup) {
      return;
    }
    this._$popup = $('<div>').addClass(DROP_DOWN_EDITOR_OVERLAY).appendTo(this.$element());
    this._renderPopup();
    this._renderPopupContent();
    this._setPopupAriaLabel();
  },
  _setPopupAriaLabel() {
    var $overlayContent = this._popup.$overlayContent();
    this.setAria('label', OVERLAY_CONTENT_LABEL, $overlayContent);
  },
  _renderPopupContent: noop,
  _renderPopup: function _renderPopup() {
    var popupConfig = extend(this._popupConfig(), this._options.cache('dropDownOptions'));
    delete popupConfig.closeOnOutsideClick;
    this._popup = this._createComponent(this._$popup, Popup, popupConfig);
    this._popup.on({
      'showing': this._popupShowingHandler.bind(this),
      'shown': this._popupShownHandler.bind(this),
      'hiding': this._popupHidingHandler.bind(this),
      'hidden': this._popupHiddenHandler.bind(this),
      'contentReady': this._contentReadyHandler.bind(this)
    });
    this._attachPopupKeyHandler();
    this._contentReadyHandler();
    this._setPopupContentId(this._popup.$content());
    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  },
  _attachPopupKeyHandler() {
    eventsEngine.on(this._popup.$overlayContent(), addNamespace('keydown', this.NAME), e => this._popupKeyHandler(e));
  },
  _popupKeyHandler(e) {
    switch (normalizeKeyName(e)) {
      case 'tab':
        this._popupTabHandler(e);
        break;
      case 'escape':
        this._popupEscHandler(e);
        break;
    }
  },
  _popupTabHandler(e) {
    var $target = $(e.target);
    var moveBackward = e.shiftKey && $target.is(this._getFirstPopupElement());
    var moveForward = !e.shiftKey && $target.is(this._getLastPopupElement());
    if (moveForward || moveBackward) {
      eventsEngine.trigger(this.field(), 'focus');
      e.preventDefault();
    }
  },
  _popupEscHandler() {
    eventsEngine.trigger(this._input(), 'focus');
    this.close();
  },
  _setPopupContentId($popupContent) {
    this._popupContentId = 'dx-' + new Guid();
    this.setAria('id', this._popupContentId, $popupContent);
  },
  _contentReadyHandler: noop,
  _popupConfig: function _popupConfig() {
    return {
      onInitialized: this._getPopupInitializedHandler(),
      position: extend(this.option('popupPosition'), {
        of: this.$element()
      }),
      showTitle: this.option('dropDownOptions.showTitle'),
      _ignoreFunctionValueDeprecation: true,
      width: () => getElementWidth(this.$element()),
      height: 'auto',
      shading: false,
      hideOnParentScroll: true,
      hideOnOutsideClick: e => this._closeOutsideDropDownHandler(e),
      animation: {
        show: {
          type: 'fade',
          duration: 0,
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          duration: 400,
          from: 1,
          to: 0
        }
      },
      deferRendering: false,
      focusStateEnabled: false,
      showCloseButton: false,
      dragEnabled: false,
      toolbarItems: this._getPopupToolbarItems(),
      onPositioned: this._popupPositionedHandler.bind(this),
      fullScreen: false,
      contentTemplate: null,
      _hideOnParentScrollTarget: this.$element(),
      _wrapperClassExternal: DROP_DOWN_EDITOR_OVERLAY,
      _ignorePreventScrollEventsDeprecation: true
    };
  },
  _popupInitializedHandler: noop,
  _getPopupInitializedHandler: function _getPopupInitializedHandler() {
    var onPopupInitialized = this.option('onPopupInitialized');
    return e => {
      this._popupInitializedHandler(e);
      if (onPopupInitialized) {
        this._popupInitializedAction({
          popup: e.component
        });
      }
    };
  },
  _dimensionChanged: function _dimensionChanged() {
    // TODO: Use ResizeObserver to hide popup after editor visibility change
    // instead of window's dimension change,
    if (hasWindow() && !this.$element().is(':visible')) {
      this.close();
      return;
    }
    this._updatePopupWidth();
  },
  _updatePopupWidth: function _updatePopupWidth() {
    var popupWidth = getSizeValue(this.option('dropDownOptions.width'));
    if (popupWidth === undefined) {
      this._setPopupOption('width', () => getElementWidth(this.$element()));
    }
  },
  _popupPositionedHandler: function _popupPositionedHandler(e) {
    var _e$position, _e$position$v;
    var {
      labelMode,
      stylingMode
    } = this.option();
    if (!this._popup) {
      return;
    }
    var $popupOverlayContent = this._popup.$overlayContent();
    var isOverlayFlipped = (_e$position = e.position) === null || _e$position === void 0 ? void 0 : (_e$position$v = _e$position.v) === null || _e$position$v === void 0 ? void 0 : _e$position$v.flip;
    var shouldIndentForLabel = labelMode !== 'hidden' && labelMode !== 'outside' && stylingMode === 'outlined';
    if (e.position) {
      $popupOverlayContent.toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, isOverlayFlipped);
    }
    if (isOverlayFlipped && shouldIndentForLabel && this._label.isVisible()) {
      var $label = this._label.$element();
      move($popupOverlayContent, {
        top: locate($popupOverlayContent).top - parseInt($label.css('fontSize'))
      });
    }
  },
  _popupShowingHandler: noop,
  _popupHidingHandler: function _popupHidingHandler() {
    this.option('opened', false);
  },
  _popupShownHandler: function _popupShownHandler() {
    var _this$_validationMess;
    this._openAction();
    (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 ? void 0 : _this$_validationMess.option('positionSide', this._getValidationMessagePositionSide());
  },
  _popupHiddenHandler: function _popupHiddenHandler() {
    var _this$_validationMess2;
    this._closeAction();
    (_this$_validationMess2 = this._validationMessage) === null || _this$_validationMess2 === void 0 ? void 0 : _this$_validationMess2.option('positionSide', this._getValidationMessagePositionSide());
  },
  _getValidationMessagePositionSide: function _getValidationMessagePositionSide() {
    var validationMessagePosition = this.option('validationMessagePosition');
    if (validationMessagePosition !== 'auto') {
      return validationMessagePosition;
    }
    var positionSide = 'bottom';
    if (this._popup && this._popup.option('visible')) {
      var {
        top: myTop
      } = animationPosition.setup(this.$element());
      var {
        top: popupTop
      } = animationPosition.setup(this._popup.$content());
      positionSide = myTop + this.option('popupPosition').offset.v > popupTop ? 'bottom' : 'top';
    }
    return positionSide;
  },
  _closeOutsideDropDownHandler: function _closeOutsideDropDownHandler(_ref) {
    var {
      target
    } = _ref;
    var $target = $(target);
    var dropDownButton = this.getButton('dropDown');
    var $dropDownButton = dropDownButton && dropDownButton.$element();
    var isInputClicked = !!$target.closest(this.$element()).length;
    var isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
    var isOutsideClick = !isInputClicked && !isDropDownButtonClicked;
    return isOutsideClick;
  },
  _clean: function _clean() {
    delete this._openOnFieldClickAction;
    if (this._$popup) {
      this._$popup.remove();
      delete this._$popup;
      delete this._popup;
    }
    this.callBase();
  },
  _setPopupOption: function _setPopupOption(optionName, value) {
    this._setWidgetOption('_popup', arguments);
  },
  _validatedOpening: function _validatedOpening() {
    if (!this.option('readOnly')) {
      this._toggleOpenState(true);
    }
  },
  _getPopupToolbarItems: function _getPopupToolbarItems() {
    return this.option('applyValueMode') === 'useButtons' ? this._popupToolbarItemsConfig() : [];
  },
  _getFirstPopupElement: function _getFirstPopupElement() {
    return $(this._popup.getFocusableElements()).first();
  },
  _getLastPopupElement: function _getLastPopupElement() {
    return $(this._popup.getFocusableElements()).last();
  },
  _popupToolbarItemsConfig: function _popupToolbarItemsConfig() {
    var buttonsConfig = [{
      shortcut: 'done',
      options: {
        onClick: this._applyButtonHandler.bind(this),
        text: this.option('applyButtonText')
      }
    }, {
      shortcut: 'cancel',
      options: {
        onClick: this._cancelButtonHandler.bind(this),
        text: this.option('cancelButtonText')
      }
    }];
    return this._applyButtonsLocation(buttonsConfig);
  },
  _applyButtonsLocation: function _applyButtonsLocation(buttonsConfig) {
    var buttonsLocation = this.option('buttonsLocation');
    var resultConfig = buttonsConfig;
    if (buttonsLocation !== 'default') {
      var position = splitPair(buttonsLocation);
      each(resultConfig, function (_, element) {
        extend(element, {
          toolbar: position[0],
          location: position[1]
        });
      });
    }
    return resultConfig;
  },
  _applyButtonHandler: function _applyButtonHandler() {
    this.close();
    this.option('focusStateEnabled') && this.focus();
  },
  _cancelButtonHandler: function _cancelButtonHandler() {
    this.close();
    this.option('focusStateEnabled') && this.focus();
  },
  _popupOptionChanged: function _popupOptionChanged(args) {
    var options = Widget.getOptionsFromContainer(args);
    this._setPopupOption(options);
    var optionsKeys = Object.keys(options);
    if (optionsKeys.indexOf('width') !== -1 || optionsKeys.indexOf('height') !== -1) {
      this._dimensionChanged();
    }
  },
  _renderSubmitElement: function _renderSubmitElement() {
    if (this.option('useHiddenSubmitElement')) {
      this._$submitElement = $('<input>').attr('type', 'hidden').appendTo(this.$element());
    }
  },
  _setSubmitValue: function _setSubmitValue() {
    this._getSubmitElement().val(this.option('value'));
  },
  _getSubmitElement: function _getSubmitElement() {
    if (this.option('useHiddenSubmitElement')) {
      return this._$submitElement;
    } else {
      return this.callBase();
    }
  },
  _dispose: function _dispose() {
    this._detachFocusOutEvents();
    this.callBase();
  },
  _optionChanged: function _optionChanged(args) {
    var _this$_popup;
    switch (args.name) {
      case 'width':
      case 'height':
        this.callBase(args);
        (_this$_popup = this._popup) === null || _this$_popup === void 0 ? void 0 : _this$_popup.repaint();
        break;
      case 'opened':
        this._renderOpenedState();
        break;
      case 'onOpened':
      case 'onClosed':
        this._initVisibilityActions();
        break;
      case 'onPopupInitialized':
        // for dashboards
        this._initPopupInitializedAction();
        break;
      case 'fieldTemplate':
        if (isDefined(args.value)) {
          this._renderField();
        } else {
          this._invalidate();
        }
        break;
      case 'acceptCustomValue':
      case 'openOnFieldClick':
        this._invalidate();
        break;
      case 'dropDownButtonTemplate':
      case 'showDropDownButton':
        this._updateButtons(['dropDown']);
        break;
      case 'dropDownOptions':
        this._popupOptionChanged(args);
        this._options.cache('dropDownOptions', this.option('dropDownOptions'));
        break;
      case 'popupPosition':
        break;
      case 'deferRendering':
        if (hasWindow()) {
          this._createPopup();
        }
        break;
      case 'applyValueMode':
      case 'applyButtonText':
      case 'cancelButtonText':
      case 'buttonsLocation':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'useHiddenSubmitElement':
        if (this._$submitElement) {
          this._$submitElement.remove();
          this._$submitElement = undefined;
        }
        this._renderSubmitElement();
        break;
      case 'rtlEnabled':
        this._updatePopupPosition(args.value);
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
  open: function open() {
    this.option('opened', true);
  },
  close: function close() {
    this.option('opened', false);
  },
  field: function field() {
    return getPublicElement(this._input());
  },
  content: function content() {
    return this._popup ? this._popup.content() : null;
  }
});
registerComponent('dxDropDownEditor', DropDownEditor);
export default DropDownEditor;