/**
* DevExtreme (bundles/__internal/scheduler/appointment_popup/m_popup.js)
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
exports.AppointmentPopup = exports.ACTION_TO_APPOINTMENT = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _deferred = require("../../../core/utils/deferred");
var _visibility_change = require("../../../events/visibility_change");
var _ui = _interopRequireDefault(require("../../../ui/popup/ui.popup"));
var _m_expression_utils = require("../../scheduler/m_expression_utils");
var _index = require("../__migration/appointment_popup/index");
var _m_appointment_adapter = require("../m_appointment_adapter");
var _m_loading = require("../m_loading");
var _m_utils = require("../resources/m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const toMs = _date.default.dateToMilliseconds;
const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';
const DAY_IN_MS = toMs('day');
const POPUP_CONFIG = {
  height: 'auto',
  maxHeight: '100%',
  showCloseButton: false,
  showTitle: false,
  preventScrollEvents: false,
  enableBodyScroll: false,
  defaultOptionsRules: [{
    device: () => _devices.default.current().android,
    options: {
      showTitle: false
    }
  }],
  _ignorePreventScrollEventsDeprecation: true
};
const ACTION_TO_APPOINTMENT = exports.ACTION_TO_APPOINTMENT = {
  CREATE: 0,
  UPDATE: 1,
  EXCLUDE_FROM_SERIES: 2
};
let AppointmentPopup = exports.AppointmentPopup = /*#__PURE__*/function () {
  function AppointmentPopup(scheduler, form) {
    this.scheduler = scheduler;
    this.form = form;
    this.popup = null;
    this.state = {
      action: null,
      lastEditData: null,
      saveChangesLocker: false,
      appointment: {
        data: null
      }
    };
  }
  var _proto = AppointmentPopup.prototype;
  _proto.show = function show(appointment, config) {
    this.state.appointment.data = appointment;
    this.state.action = config.action;
    this.state.excludeInfo = config.excludeInfo;
    if (!this.popup) {
      const popupConfig = this._createPopupConfig();
      this.popup = this._createPopup(popupConfig);
    }
    this.popup.option('toolbarItems', (0, _index.getPopupToolbarItems)(config.isToolbarVisible, e => this._doneButtonClickHandler(e)));
    this.popup.show();
  };
  _proto.hide = function hide() {
    this.popup.hide();
  };
  _proto.dispose = function dispose() {
    var _a;
    (_a = this.popup) === null || _a === void 0 ? void 0 : _a.$element().remove();
  };
  _proto._createPopup = function _createPopup(options) {
    const popupElement = (0, _renderer.default)('<div>').addClass(APPOINTMENT_POPUP_CLASS).appendTo(this.scheduler.getElement());
    return this.scheduler.createComponent(popupElement, _ui.default, options);
  };
  _proto._createPopupConfig = function _createPopupConfig() {
    return _extends(_extends({}, POPUP_CONFIG), {
      onHiding: () => this.scheduler.focus(),
      contentTemplate: () => this._createPopupContent(),
      onShowing: e => this._onShowing(e),
      wrapperAttr: {
        class: APPOINTMENT_POPUP_CLASS
      }
    });
  };
  _proto._onShowing = function _onShowing(e) {
    this._updateForm();
    const arg = {
      form: this.form.dxForm,
      popup: this.popup,
      appointmentData: this.state.appointment.data,
      cancel: false
    };
    this.scheduler.getAppointmentFormOpening()(arg);
    this.scheduler.processActionResult(arg, canceled => {
      if (canceled) {
        e.cancel = true;
      } else {
        this.updatePopupFullScreenMode();
      }
    });
  };
  _proto._createPopupContent = function _createPopupContent() {
    this._createForm();
    return this.form.dxForm.$element(); // TODO
  };
  _proto._createFormData = function _createFormData(rawAppointment) {
    const appointment = this._createAppointmentAdapter(rawAppointment);
    const dataAccessors = this.scheduler.getDataAccessors();
    const resources = this.scheduler.getResources();
    const normalizedResources = (0, _m_utils.getNormalizedResources)(rawAppointment, dataAccessors, resources);
    return _extends(_extends(_extends({}, rawAppointment), normalizedResources), {
      repeat: !!appointment.recurrenceRule
    });
  };
  _proto._createForm = function _createForm() {
    const rawAppointment = this.state.appointment.data;
    const formData = this._createFormData(rawAppointment);
    this.form.create(this.triggerResize.bind(this), this.changeSize.bind(this), formData); // TODO
  };
  _proto._isReadOnly = function _isReadOnly(rawAppointment) {
    const appointment = this._createAppointmentAdapter(rawAppointment);
    if (rawAppointment && appointment.disabled) {
      return true;
    }
    if (this.state.action === ACTION_TO_APPOINTMENT.CREATE) {
      return false;
    }
    return !this.scheduler.getEditingConfig().allowUpdating;
  };
  _proto._createAppointmentAdapter = function _createAppointmentAdapter(rawAppointment) {
    return (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this.scheduler.getDataAccessors(), this.scheduler.getTimeZoneCalculator());
  };
  _proto._updateForm = function _updateForm() {
    const {
      data
    } = this.state.appointment;
    const appointment = this._createAppointmentAdapter(this._createFormData(data));
    if (appointment.startDate) {
      appointment.startDate = appointment.calculateStartDate('toAppointment');
    }
    if (appointment.endDate) {
      appointment.endDate = appointment.calculateEndDate('toAppointment');
    }
    const formData = appointment.clone().source();
    this.form.readOnly = this._isReadOnly(formData);
    this.form.updateFormData(formData);
  };
  _proto.triggerResize = function triggerResize() {
    if (this.popup) {
      (0, _visibility_change.triggerResizeEvent)(this.popup.$element());
    }
  };
  _proto.changeSize = function changeSize(isRecurrence) {
    if (this.popup) {
      const isFullScreen = (0, _index.isPopupFullScreenNeeded)();
      const maxWidth = isFullScreen ? '100%' : (0, _index.getMaxWidth)(isRecurrence);
      this.popup.option('fullScreen', isFullScreen);
      this.popup.option('maxWidth', maxWidth);
    }
  };
  _proto.updatePopupFullScreenMode = function updatePopupFullScreenMode() {
    if (this.form.dxForm && this.visible) {
      // TODO
      const {
        formData
      } = this.form;
      const dataAccessors = this.scheduler.getDataAccessors();
      const isRecurrence = _m_expression_utils.ExpressionUtils.getField(dataAccessors, 'recurrenceRule', formData);
      this.changeSize(isRecurrence);
    }
  };
  _proto.saveChangesAsync = function saveChangesAsync(isShowLoadPanel) {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const validation = this.form.dxForm.validate();
    isShowLoadPanel && this._showLoadPanel();
    (0, _deferred.when)(validation && validation.complete || validation).done(validation => {
      if (validation && !validation.isValid) {
        (0, _m_loading.hide)();
        deferred.resolve(false);
        return;
      }
      const adapter = this._createAppointmentAdapter(this.form.formData);
      const clonedAdapter = adapter.clone({
        pathTimeZone: 'fromAppointment'
      }); // TODO:
      this._addMissingDSTTime(adapter, clonedAdapter);
      const appointment = clonedAdapter.source();
      delete appointment.repeat; // TODO
      switch (this.state.action) {
        case ACTION_TO_APPOINTMENT.CREATE:
          this.scheduler.addAppointment(appointment).done(deferred.resolve);
          break;
        case ACTION_TO_APPOINTMENT.UPDATE:
          this.scheduler.updateAppointment(this.state.appointment.data, appointment).done(deferred.resolve);
          break;
        case ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES:
          this.scheduler.updateAppointment(this.state.excludeInfo.sourceAppointment, this.state.excludeInfo.updatedAppointment);
          this.scheduler.addAppointment(appointment).done(deferred.resolve);
          break;
        default:
          break;
      }
      deferred.done(() => {
        (0, _m_loading.hide)();
        this.state.lastEditData = appointment;
      });
    });
    return deferred.promise();
  };
  _proto._doneButtonClickHandler = function _doneButtonClickHandler(e) {
    e.cancel = true;
    this.saveEditDataAsync();
  };
  _proto.saveEditDataAsync = function saveEditDataAsync() {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    if (this._tryLockSaveChanges()) {
      (0, _deferred.when)(this.saveChangesAsync(true)).done(() => {
        if (this.state.lastEditData) {
          // TODO
          const adapter = this._createAppointmentAdapter(this.state.lastEditData);
          const {
            startDate,
            endDate,
            allDay
          } = adapter;
          const startTime = startDate.getTime();
          const endTime = endDate.getTime();
          const inAllDayRow = allDay || endTime - startTime >= DAY_IN_MS;
          const dataAccessors = this.scheduler.getDataAccessors();
          const resourceList = this.scheduler.getResources();
          const normalizedResources = (0, _m_utils.getNormalizedResources)(this.state.lastEditData, dataAccessors, resourceList);
          this.scheduler.updateScrollPosition(startDate, normalizedResources, inAllDayRow);
          this.state.lastEditData = null;
        }
        this._unlockSaveChanges();
        deferred.resolve();
      });
    }
    return deferred.promise();
  };
  _proto._showLoadPanel = function _showLoadPanel() {
    const container = this.popup.$overlayContent();
    (0, _m_loading.show)({
      container,
      position: {
        of: container
      }
    });
  };
  _proto._tryLockSaveChanges = function _tryLockSaveChanges() {
    if (this.state.saveChangesLocker === false) {
      this.state.saveChangesLocker = true;
      return true;
    }
    return false;
  };
  _proto._unlockSaveChanges = function _unlockSaveChanges() {
    this.state.saveChangesLocker = false;
  }
  // NOTE: Fix ticket T1102713
  ;
  _proto._addMissingDSTTime = function _addMissingDSTTime(formAppointmentAdapter, clonedAppointmentAdapter) {
    const timeZoneCalculator = this.scheduler.getTimeZoneCalculator();
    clonedAppointmentAdapter.startDate = this._addMissingDSTShiftToDate(timeZoneCalculator, formAppointmentAdapter.startDate, clonedAppointmentAdapter.startDate);
    if (clonedAppointmentAdapter.endDate) {
      clonedAppointmentAdapter.endDate = this._addMissingDSTShiftToDate(timeZoneCalculator, formAppointmentAdapter.endDate, clonedAppointmentAdapter.endDate);
    }
  };
  _proto._addMissingDSTShiftToDate = function _addMissingDSTShiftToDate(timeZoneCalculator, originFormDate, clonedDate) {
    var _a, _b;
    const originTimezoneShift = (_a = timeZoneCalculator.getOffsets(originFormDate)) === null || _a === void 0 ? void 0 : _a.common;
    const clonedTimezoneShift = (_b = timeZoneCalculator.getOffsets(clonedDate)) === null || _b === void 0 ? void 0 : _b.common;
    const shiftDifference = originTimezoneShift - clonedTimezoneShift;
    return shiftDifference ? new Date(clonedDate.getTime() + shiftDifference * toMs('hour')) : clonedDate;
  };
  _createClass(AppointmentPopup, [{
    key: "visible",
    get: function () {
      return this.popup ? this.popup.option('visible') : false;
    }
  }]);
  return AppointmentPopup;
}();
