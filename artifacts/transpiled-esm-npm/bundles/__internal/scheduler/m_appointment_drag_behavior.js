"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _draggable = _interopRequireDefault(require("../../ui/draggable"));
var _m_constants = require("./m_constants");
var _is_scheduler_component = require("./utils/is_scheduler_component");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';
let AppointmentDragBehavior = exports.default = /*#__PURE__*/function () {
  function AppointmentDragBehavior(scheduler) {
    this.scheduler = scheduler;
    this.workspace = this.scheduler._workSpace;
    this.appointments = this.scheduler._appointments;
    this.initialPosition = {
      left: 0,
      top: 0
    };
    this.appointmentInfo = null;
    this.dragBetweenComponentsPromise = null;
  }
  var _proto = AppointmentDragBehavior.prototype;
  _proto.isAllDay = function isAllDay(appointment) {
    return appointment.data('dxAppointmentSettings').allDay;
  };
  _proto.onDragStart = function onDragStart(e) {
    const {
      itemSettings,
      itemData,
      initialPosition
    } = e;
    this.initialPosition = initialPosition;
    this.appointmentInfo = {
      appointment: itemData,
      settings: itemSettings
    };
    this.appointments.notifyObserver('hideAppointmentTooltip');
  };
  _proto.onDragMove = function onDragMove(e) {
    if (e.fromComponent !== e.toComponent) {
      this.appointments.notifyObserver('removeDroppableCellClass');
    }
  };
  _proto.getAppointmentElement = function getAppointmentElement(e) {
    const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;
    return (0, _renderer.default)(itemElement);
  };
  _proto.onDragEnd = function onDragEnd(event) {
    const element = this.getAppointmentElement(event);
    const rawAppointment = this.appointments._getItemData(element);
    const container = this.appointments._getAppointmentContainer(this.isAllDay(element));
    container.append(element);
    const newCellIndex = this.workspace.getDroppableCellIndex();
    const oldCellIndex = this.workspace.getCellIndexByCoordinates(this.initialPosition);
    this.appointments.notifyObserver('updateAppointmentAfterDrag', {
      event,
      element,
      rawAppointment,
      newCellIndex,
      oldCellIndex
    });
  };
  _proto.onDragCancel = function onDragCancel() {
    this.removeDroppableClasses();
  };
  _proto.getItemData = function getItemData(appointmentElement) {
    const dataFromTooltip = (0, _renderer.default)(appointmentElement).data(_m_constants.LIST_ITEM_DATA_KEY);
    const itemDataFromTooltip = dataFromTooltip === null || dataFromTooltip === void 0 ? void 0 : dataFromTooltip.appointment;
    const itemDataFromGrid = this.appointments._getItemData(appointmentElement);
    return itemDataFromTooltip || itemDataFromGrid;
  };
  _proto.getItemSettings = function getItemSettings(appointment) {
    const itemData = (0, _renderer.default)(appointment).data(_m_constants.LIST_ITEM_DATA_KEY);
    return itemData && itemData.settings || [];
  };
  _proto.createDragStartHandler = function createDragStartHandler(options, appointmentDragging) {
    return e => {
      e.itemData = this.getItemData(e.itemElement);
      e.itemSettings = this.getItemSettings(e.itemElement);
      appointmentDragging.onDragStart && appointmentDragging.onDragStart(e);
      if (!e.cancel) {
        options.onDragStart(e);
      }
    };
  };
  _proto.createDragMoveHandler = function createDragMoveHandler(options, appointmentDragging) {
    return e => {
      appointmentDragging.onDragMove && appointmentDragging.onDragMove(e);
      if (!e.cancel) {
        options.onDragMove(e);
      }
    };
  };
  _proto.createDragEndHandler = function createDragEndHandler(options, appointmentDragging) {
    return e => {
      const updatedData = this.appointments.invoke('getUpdatedData', e.itemData);
      this.appointmentInfo = null;
      e.toItemData = (0, _extend.extend)({}, e.itemData, updatedData);
      appointmentDragging.onDragEnd && appointmentDragging.onDragEnd(e);
      if (!e.cancel) {
        options.onDragEnd(e);
        if (e.fromComponent !== e.toComponent) {
          appointmentDragging.onRemove && appointmentDragging.onRemove(e);
        }
      }
      // NOTE: event.cancel may be promise or different type, so we need strict check here.
      if (e.cancel === true) {
        this.removeDroppableClasses();
      }
      if (e.cancel !== true && (0, _is_scheduler_component.isSchedulerComponent)(e.toComponent)) {
        const targetDragBehavior = e.toComponent._getDragBehavior();
        // @ts-expect-error
        targetDragBehavior.dragBetweenComponentsPromise = new _deferred.Deferred();
      }
    };
  };
  _proto.createDropHandler = function createDropHandler(appointmentDragging) {
    return e => {
      const updatedData = this.appointments.invoke('getUpdatedData', e.itemData);
      e.itemData = (0, _extend.extend)({}, e.itemData, updatedData);
      if (e.fromComponent !== e.toComponent) {
        appointmentDragging.onAdd && appointmentDragging.onAdd(e);
      }
      if (this.dragBetweenComponentsPromise) {
        this.dragBetweenComponentsPromise.resolve();
      }
    };
  };
  _proto.addTo = function addTo(container, config) {
    const appointmentDragging = this.scheduler.option('appointmentDragging') || {};
    const options = (0, _extend.extend)({
      component: this.scheduler,
      contentTemplate: null,
      filter: ".".concat(APPOINTMENT_ITEM_CLASS),
      immediate: false,
      onDragStart: this.onDragStart.bind(this),
      onDragMove: this.onDragMove.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onDragCancel: this.onDragCancel.bind(this)
    }, config);
    this.appointments._createComponent(container, _draggable.default, (0, _extend.extend)({}, options, appointmentDragging, {
      onDragStart: this.createDragStartHandler(options, appointmentDragging),
      onDragMove: this.createDragMoveHandler(options, appointmentDragging),
      onDragEnd: this.createDragEndHandler(options, appointmentDragging),
      onDrop: this.createDropHandler(appointmentDragging),
      onCancelByEsc: true
    }));
  };
  _proto.updateDragSource = function updateDragSource(appointment, settings) {
    const {
      appointmentInfo
    } = this;
    if (appointmentInfo || appointment) {
      const currentAppointment = appointment || appointmentInfo.appointment;
      const currentSettings = settings || appointmentInfo.settings;
      this.appointments._setDragSourceAppointment(currentAppointment, currentSettings);
    }
  };
  _proto.removeDroppableClasses = function removeDroppableClasses() {
    this.appointments._removeDragSourceClassFromDraggedAppointment();
    this.workspace.removeDroppableCellClass();
  };
  return AppointmentDragBehavior;
}();