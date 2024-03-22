/**
* DevExtreme (cjs/__internal/scheduler/m_compact_appointments_helper.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompactAppointmentsHelper = void 0;
var _translator = require("../../animation/translator");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _function_template = require("../../core/templates/function_template");
var _deferred = require("../../core/utils/deferred");
var _position = require("../../core/utils/position");
var _message = _interopRequireDefault(require("../../localization/message"));
var _button = _interopRequireDefault(require("../../ui/button"));
var _index = require("./__migration/utils/index");
var _m_appointment_adapter = require("./m_appointment_adapter");
var _m_constants = require("./m_constants");
var _m_data_structures = require("./m_data_structures");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
const COMPACT_APPOINTMENT_COLLECTOR_CLASS = "".concat(APPOINTMENT_COLLECTOR_CLASS, "-compact");
const APPOINTMENT_COLLECTOR_CONTENT_CLASS = "".concat(APPOINTMENT_COLLECTOR_CLASS, "-content");
const WEEK_VIEW_COLLECTOR_OFFSET = 5;
const COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;
let CompactAppointmentsHelper = exports.CompactAppointmentsHelper = /*#__PURE__*/function () {
  function CompactAppointmentsHelper(instance) {
    this.instance = instance;
    this.elements = [];
  }
  var _proto = CompactAppointmentsHelper.prototype;
  _proto.render = function render(options) {
    const {
      isCompact,
      items,
      buttonColor
    } = options;
    const template = this._createTemplate(items.data.length, isCompact);
    const button = this._createCompactButton(template, options);
    const $button = button.$element();
    this._makeBackgroundColor($button, items.colors, buttonColor);
    this._makeBackgroundDarker($button);
    this.elements.push($button);
    $button.data('items', this._createTooltipInfos(items));
    return $button;
  };
  _proto.clear = function clear() {
    this.elements.forEach(button => {
      button.detach();
      button.remove();
    });
    this.elements = [];
  };
  _proto._createTooltipInfos = function _createTooltipInfos(items) {
    return items.data.map((appointment, index) => {
      var _a;
      const targetedAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(appointment, this.instance._dataAccessors, this.instance.timeZoneCalculator).clone();
      if (((_a = items.settings) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const {
          info
        } = items.settings[index];
        targetedAdapter.startDate = info.sourceAppointment.startDate;
        targetedAdapter.endDate = info.sourceAppointment.endDate;
      }
      return new _m_data_structures.AppointmentTooltipInfo(appointment, targetedAdapter.source(), items.colors[index], items.settings[index]);
    });
  };
  _proto._onButtonClick = function _onButtonClick(e, options) {
    const $button = (0, _renderer.default)(e.element);
    this.instance.showAppointmentTooltipCore($button, $button.data('items'), this._getExtraOptionsForTooltip(options, $button));
  };
  _proto._getExtraOptionsForTooltip = function _getExtraOptionsForTooltip(options, $appointmentCollector) {
    return {
      clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag && this._createTooltipDragBehavior($appointmentCollector).bind(this),
      dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate,
      isButtonClick: true
    };
  };
  _proto._clickEvent = function _clickEvent(onAppointmentClick) {
    return e => {
      const clickEventArgs = this.instance._createEventArgs(e);
      onAppointmentClick(clickEventArgs);
    };
  };
  _proto._createTooltipDragBehavior = function _createTooltipDragBehavior($appointmentCollector) {
    return e => {
      const $element = (0, _renderer.default)(e.element);
      const $schedulerElement = (0, _renderer.default)(this.instance.element());
      const workSpace = this.instance.getWorkSpace();
      const getItemData = itemElement => {
        var _a;
        return (_a = (0, _renderer.default)(itemElement).data(_m_constants.LIST_ITEM_DATA_KEY)) === null || _a === void 0 ? void 0 : _a.appointment;
      };
      const getItemSettings = (_, event) => event.itemSettings;
      const initialPosition = (0, _translator.locate)($appointmentCollector);
      const options = {
        filter: ".".concat(_m_constants.LIST_ITEM_CLASS),
        isSetCursorOffset: true,
        initialPosition,
        getItemData,
        getItemSettings
      };
      workSpace._createDragBehaviorBase($element, $schedulerElement, options);
    };
  };
  _proto._getCollectorOffset = function _getCollectorOffset(width, cellWidth) {
    return cellWidth - width - this._getCollectorRightOffset();
  };
  _proto._getCollectorRightOffset = function _getCollectorRightOffset() {
    return this.instance.getRenderingStrategyInstance()._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET;
  };
  _proto._makeBackgroundDarker = function _makeBackgroundDarker(button) {
    button.css('boxShadow', "inset ".concat((0, _position.getBoundingRect)(button.get(0)).width, "px 0 0 0 rgba(0, 0, 0, 0.3)"));
  };
  _proto._makeBackgroundColor = function _makeBackgroundColor($button, colors, color) {
    _deferred.when.apply(null, colors).done(function () {
      this._makeBackgroundColorCore($button, color, [...arguments]);
    }.bind(this));
  };
  _proto._makeBackgroundColorCore = function _makeBackgroundColorCore($button, color, itemColors) {
    color && color.done(color => {
      const backgroundColor = (0, _index.getOverflowIndicatorColor)(color, itemColors);
      if (backgroundColor) {
        $button.css('backgroundColor', backgroundColor);
      }
    });
  };
  _proto._setPosition = function _setPosition(element, position) {
    (0, _translator.move)(element, {
      top: position.top,
      left: position.left
    });
  };
  _proto._createCompactButton = function _createCompactButton(template, options) {
    const $button = this._createCompactButtonElement(options);
    return this.instance._createComponent($button, _button.default, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: e => this._onButtonClick(e, options),
      template: this._renderTemplate(template, options.items, options.isCompact)
    });
  };
  _proto._createCompactButtonElement = function _createCompactButtonElement(_ref) {
    let {
      isCompact,
      $container,
      coordinates
    } = _ref;
    const result = (0, _renderer.default)('<div>').addClass(APPOINTMENT_COLLECTOR_CLASS).toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact).appendTo($container);
    this._setPosition(result, coordinates);
    return result;
  };
  _proto._renderTemplate = function _renderTemplate(template, items, isCompact) {
    return new _function_template.FunctionTemplate(options => template.render({
      model: {
        appointmentCount: items.data.length,
        isCompact
      },
      container: options.container
    }));
  };
  _proto._createTemplate = function _createTemplate(count, isCompact) {
    this._initButtonTemplate(count, isCompact);
    return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
  };
  _proto._initButtonTemplate = function _initButtonTemplate(count, isCompact) {
    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new _function_template.FunctionTemplate(options => this._createButtonTemplate(count, (0, _renderer.default)(options.container), isCompact))
    });
  };
  _proto._createButtonTemplate = function _createButtonTemplate(appointmentCount, element, isCompact) {
    const text = isCompact ? appointmentCount : _message.default.getFormatter('dxScheduler-moreAppointments')(appointmentCount);
    return element.append((0, _renderer.default)('<span>').text(text)).addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  };
  return CompactAppointmentsHelper;
}();
