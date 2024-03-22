"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _config = _interopRequireDefault(require("../../core/config"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _bindable_template = require("../../core/templates/bindable_template");
var _empty_template = require("../../core/templates/empty_template");
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _common = require("../../core/utils/common");
var _data = require("../../core/utils/data");
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _position = require("../../core/utils/position");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _data_helper = _interopRequireDefault(require("../../data_helper"));
var _visibility_change = require("../../events/visibility_change");
var _date2 = _interopRequireDefault(require("../../localization/date"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _dialog = require("../../ui/dialog");
var _themes = require("../../ui/themes");
var _ui = _interopRequireDefault(require("../../ui/widget/ui.errors"));
var _ui2 = _interopRequireDefault(require("../../ui/widget/ui.widget"));
var _date3 = require("../core/utils/date");
var _index = require("./__migration/timezone_calculator/index");
var _index2 = require("./__migration/utils/index");
var _m_form = require("./appointment_popup/m_form");
var _m_popup = require("./appointment_popup/m_popup");
var _m_appointment_data_provider = require("./appointments/data_provider/m_appointment_data_provider");
var _m_appointment_collection = _interopRequireDefault(require("./appointments/m_appointment_collection"));
var _m_header = require("./header/m_header");
var _m_appointment_adapter = require("./m_appointment_adapter");
var _m_appointments_layout_manager = _interopRequireDefault(require("./m_appointments_layout_manager"));
var _m_compact_appointments_helper = require("./m_compact_appointments_helper");
var _m_constants = require("./m_constants");
var _m_data_structures = require("./m_data_structures");
var _m_expression_utils = require("./m_expression_utils");
var _m_loading = require("./m_loading");
var _m_recurrence = require("./m_recurrence");
var _m_subscribes = _interopRequireDefault(require("./m_subscribes"));
var _m_utils = require("./m_utils");
var _m_utils_time_zone = _interopRequireDefault(require("./m_utils_time_zone"));
var _index3 = require("./options_validator/index");
var _m_agenda_resource_processor = require("./resources/m_agenda_resource_processor");
var _m_utils2 = require("./resources/m_utils");
var _m_desktop_tooltip_strategy = require("./tooltip_strategies/m_desktop_tooltip_strategy");
var _m_mobile_tooltip_strategy = require("./tooltip_strategies/m_mobile_tooltip_strategy");
var _m_agenda = _interopRequireDefault(require("./workspaces/m_agenda"));
var _m_timeline_day = _interopRequireDefault(require("./workspaces/m_timeline_day"));
var _m_timeline_month = _interopRequireDefault(require("./workspaces/m_timeline_month"));
var _m_timeline_week = _interopRequireDefault(require("./workspaces/m_timeline_week"));
var _m_timeline_work_week = _interopRequireDefault(require("./workspaces/m_timeline_work_week"));
var _m_work_space_day = _interopRequireDefault(require("./workspaces/m_work_space_day"));
var _m_work_space_month = _interopRequireDefault(require("./workspaces/m_work_space_month"));
var _m_work_space_week = _interopRequireDefault(require("./workspaces/m_work_space_week"));
var _m_work_space_work_week = _interopRequireDefault(require("./workspaces/m_work_space_work_week"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // @ts-expect-error
const toMs = _date.default.dateToMilliseconds;
const DEFAULT_AGENDA_DURATION = 7;
const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = "".concat(WIDGET_CLASS, "-small");
const WIDGET_ADAPTIVE_CLASS = "".concat(WIDGET_CLASS, "-adaptive");
const WIDGET_READONLY_CLASS = "".concat(WIDGET_CLASS, "-readonly");
const WIDGET_SMALL_WIDTH = 400;
const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = "".concat(FULL_DATE_FORMAT, "Z");
const DEFAULT_APPOINTMENT_TEMPLATE_NAME = 'item';
const DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME = 'appointmentCollector';
const DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME = 'dropDownAppointment';
const VIEWS_CONFIG = {
  day: {
    workSpace: _m_work_space_day.default,
    renderingStrategy: 'vertical'
  },
  week: {
    workSpace: _m_work_space_week.default,
    renderingStrategy: 'vertical'
  },
  workWeek: {
    workSpace: _m_work_space_work_week.default,
    renderingStrategy: 'vertical'
  },
  month: {
    workSpace: _m_work_space_month.default,
    renderingStrategy: 'horizontalMonth'
  },
  timelineDay: {
    workSpace: _m_timeline_day.default,
    renderingStrategy: 'horizontal'
  },
  timelineWeek: {
    workSpace: _m_timeline_week.default,
    renderingStrategy: 'horizontal'
  },
  timelineWorkWeek: {
    workSpace: _m_timeline_work_week.default,
    renderingStrategy: 'horizontal'
  },
  timelineMonth: {
    workSpace: _m_timeline_month.default,
    renderingStrategy: 'horizontalMonthLine'
  },
  agenda: {
    workSpace: _m_agenda.default,
    renderingStrategy: 'agenda'
  }
};
const StoreEventNames = {
  ADDING: 'onAppointmentAdding',
  ADDED: 'onAppointmentAdded',
  DELETING: 'onAppointmentDeleting',
  DELETED: 'onAppointmentDeleted',
  UPDATING: 'onAppointmentUpdating',
  UPDATED: 'onAppointmentUpdated'
};
const RECURRENCE_EDITING_MODE = {
  SERIES: 'editSeries',
  OCCURENCE: 'editOccurence',
  CANCEL: 'cancel'
};
let Scheduler = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(Scheduler, _Widget);
  function Scheduler() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = Scheduler.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    // @ts-expect-error
    const defaultOptions = (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      views: ['day', 'week'],
      currentView: 'day',
      currentDate: _date.default.trimTime(new Date()),
      min: undefined,
      max: undefined,
      dateSerializationFormat: undefined,
      firstDayOfWeek: undefined,
      groups: [],
      resources: [],
      loadedResources: [],
      resourceLoaderMap: new Map(),
      dataSource: null,
      customizeDateNavigatorText: undefined,
      appointmentTemplate: DEFAULT_APPOINTMENT_TEMPLATE_NAME,
      dropDownAppointmentTemplate: DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME,
      appointmentCollectorTemplate: DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME,
      dataCellTemplate: null,
      timeCellTemplate: null,
      resourceCellTemplate: null,
      dateCellTemplate: null,
      startDayHour: 0,
      endDayHour: 24,
      offset: 0,
      editing: {
        allowAdding: true,
        allowDeleting: true,
        allowDragging: true,
        allowResizing: true,
        allowUpdating: true,
        allowTimeZoneEditing: false
      },
      showAllDayPanel: true,
      showCurrentTimeIndicator: true,
      shadeUntilCurrentTime: false,
      indicatorUpdateInterval: 300000,
      indicatorTime: undefined,
      recurrenceEditMode: 'dialog',
      cellDuration: 30,
      maxAppointmentsPerCell: 'auto',
      selectedCellData: [],
      groupByDate: false,
      onAppointmentRendered: null,
      onAppointmentClick: null,
      onAppointmentDblClick: null,
      onAppointmentContextMenu: null,
      onCellClick: null,
      onCellContextMenu: null,
      onAppointmentAdding: null,
      onAppointmentAdded: null,
      onAppointmentUpdating: null,
      onAppointmentUpdated: null,
      onAppointmentDeleting: null,
      onAppointmentDeleted: null,
      onAppointmentFormOpening: null,
      onAppointmentTooltipShowing: null,
      appointmentTooltipTemplate: 'appointmentTooltip',
      appointmentPopupTemplate: 'appointmentPopup',
      crossScrollingEnabled: false,
      useDropDownViewSwitcher: false,
      startDateExpr: 'startDate',
      endDateExpr: 'endDate',
      textExpr: 'text',
      descriptionExpr: 'description',
      allDayExpr: 'allDay',
      recurrenceRuleExpr: 'recurrenceRule',
      recurrenceExceptionExpr: 'recurrenceException',
      disabledExpr: 'disabled',
      remoteFiltering: false,
      timeZone: '',
      startDateTimeZoneExpr: 'startDateTimeZone',
      endDateTimeZoneExpr: 'endDateTimeZone',
      noDataText: _message.default.format('dxCollectionWidget-noDataText'),
      adaptivityEnabled: false,
      allowMultipleCellSelection: true,
      scrolling: {
        mode: 'standard'
      },
      allDayPanelMode: 'all',
      renovateRender: true,
      _draggingMode: 'outlook',
      _appointmentTooltipOffset: {
        x: 0,
        y: 0
      },
      _appointmentTooltipButtonsPosition: 'bottom',
      _appointmentTooltipOpenButtonText: _message.default.format('dxScheduler-openAppointment'),
      _appointmentCountPerCell: 2,
      _collectorOffset: 0,
      _appointmentOffset: 26,
      toolbar: [{
        location: 'before',
        defaultElement: 'dateNavigator'
      }, {
        location: 'after',
        defaultElement: 'viewSwitcher'
      }]
    });
    return (0, _extend.extend)(true, defaultOptions, {
      integrationOptions: {
        useDeferUpdateForTemplates: false
      }
    });
  };
  _proto._setDeprecatedOptions = function _setDeprecatedOptions() {
    // @ts-expect-error
    _Widget.prototype._setDeprecatedOptions.call(this);
    // @ts-expect-error
    (0, _extend.extend)(this._deprecatedOptions, {
      dropDownAppointmentTemplate: {
        since: '19.2',
        message: 'appointmentTooltipTemplate'
      }
    });
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    // @ts-expect-error
    return _Widget.prototype._defaultOptionsRules.call(this).concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        return !_devices.default.current().generic;
      },
      options: {
        useDropDownViewSwitcher: true,
        editing: {
          allowDragging: false,
          allowResizing: false
        }
      }
    }, {
      device() {
        return (0, _themes.isMaterialBased)();
      },
      options: {
        useDropDownViewSwitcher: true,
        dateCellTemplate(data, index, element) {
          const {
            text
          } = data;
          text.split(' ').forEach((text, index) => {
            const span = (0, _renderer.default)('<span>').text(text).addClass('dx-scheduler-header-panel-cell-date');
            (0, _renderer.default)(element).append(span);
            if (!index) (0, _renderer.default)(element).append(' ');
          });
        },
        _appointmentTooltipButtonsPosition: 'top',
        _appointmentTooltipOpenButtonText: null,
        _appointmentCountPerCell: 1,
        _collectorOffset: 20,
        _appointmentOffset: 30
      }
    }, {
      device() {
        return (0, _themes.isMaterial)();
      },
      options: {
        _appointmentTooltipOffset: {
          x: 0,
          y: 11
        }
      }
    }]);
  };
  _proto._postponeDataSourceLoading = function _postponeDataSourceLoading(promise) {
    this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
  };
  _proto._postponeResourceLoading = function _postponeResourceLoading() {
    const whenLoaded = this.postponedOperations.add('loadResources', () => {
      const groups = this._getCurrentViewOption('groups');
      return (0, _m_utils2.loadResources)(groups, this.option('resources'), this.option('resourceLoaderMap'));
    });
    // @ts-expect-error
    const resolveCallbacks = new _deferred.Deferred();
    whenLoaded.done(resources => {
      this.option('loadedResources', resources);
      resolveCallbacks.resolve(resources);
    });
    this._postponeDataSourceLoading(whenLoaded);
    return resolveCallbacks.promise();
  };
  _proto._optionChanged = function _optionChanged(args) {
    var _a, _b, _c, _d;
    this.validateOptions();
    let {
      value
    } = args;
    const {
      name
    } = args;
    switch (args.name) {
      case 'customizeDateNavigatorText':
        this._updateOption('header', name, value);
        break;
      case 'firstDayOfWeek':
        this._updateOption('workSpace', name, value);
        this._updateOption('header', name, value);
        break;
      case 'currentDate':
        value = this._dateOption(name);
        value = _date.default.trimTime(new Date(value));
        this.option('selectedCellData', []);
        this._workSpace.option(name, new Date(value));
        (_a = this._header) === null || _a === void 0 ? void 0 : _a.option(name, new Date(value));
        (_b = this._header) === null || _b === void 0 ? void 0 : _b.option('startViewDate', this.getStartViewDate());
        this._appointments.option('items', []);
        this._filterAppointmentsByDate();
        this._postponeDataSourceLoading();
        break;
      case 'dataSource':
        // @ts-expect-error
        this._initDataSource();
        this.appointmentDataProvider.setDataSource(this._dataSource);
        this._postponeResourceLoading().done(() => {
          this._filterAppointmentsByDate();
          this._updateOption('workSpace', 'showAllDayPanel', this.option('showAllDayPanel'));
        });
        break;
      case 'min':
      case 'max':
        value = this._dateOption(name);
        this._updateOption('header', name, new Date(value));
        this._updateOption('workSpace', name, new Date(value));
        break;
      case 'views':
        if (this._getCurrentViewOptions()) {
          this.repaint();
        } else {
          (_c = this._header) === null || _c === void 0 ? void 0 : _c.option(name, value);
        }
        break;
      case 'useDropDownViewSwitcher':
        (_d = this._header) === null || _d === void 0 ? void 0 : _d.option(name, value);
        break;
      case 'currentView':
        this._appointments.option({
          items: [],
          allowDrag: this._allowDragging(),
          allowResize: this._allowResizing(),
          itemTemplate: this._getAppointmentTemplate('appointmentTemplate')
        });
        this._postponeResourceLoading().done(resources => {
          var _a;
          this._refreshWorkSpace(resources);
          (_a = this._header) === null || _a === void 0 ? void 0 : _a.option(this._headerConfig());
          this._filterAppointmentsByDate();
          this._appointments.option('allowAllDayResize', value !== 'day');
        });
        // NOTE:
        // Calling postponed operations (promises) here, because when we update options with
        // usage of the beginUpdate / endUpdate methods, other option changes
        // may try to access not initialized values inside the scheduler component.
        this.postponedOperations.callPostponedOperations();
        break;
      case 'appointmentTemplate':
        this._appointments.option('itemTemplate', value);
        break;
      case 'dateCellTemplate':
      case 'resourceCellTemplate':
      case 'dataCellTemplate':
      case 'timeCellTemplate':
        this.repaint();
        break;
      case 'groups':
        this._postponeResourceLoading().done(resources => {
          this._refreshWorkSpace(resources);
          this._filterAppointmentsByDate();
        });
        break;
      case 'resources':
        this._dataAccessors.resources = (0, _m_utils2.createExpressions)(this.option('resources'));
        this.agendaResourceProcessor.initializeState(this.option('resources'));
        this.updateInstances();
        this._postponeResourceLoading().done(resources => {
          this._appointments.option('items', []);
          this._refreshWorkSpace(resources);
          this._filterAppointmentsByDate();
          this._createAppointmentPopupForm();
        });
        break;
      case 'startDayHour':
      case 'endDayHour':
        this.updateInstances();
        this._appointments.option('items', []);
        this._updateOption('workSpace', name, value);
        this._appointments.repaint();
        this._filterAppointmentsByDate();
        this._postponeDataSourceLoading();
        break;
      // TODO Vinogradov refactoring: merge it with startDayHour / endDayHour
      case 'offset':
        this.updateInstances();
        this._appointments.option('items', []);
        this._updateOption('workSpace', 'viewOffset', this.normalizeViewOffsetValue(value));
        this._appointments.repaint();
        this._filterAppointmentsByDate();
        this._postponeDataSourceLoading();
        break;
      case StoreEventNames.ADDING:
      case StoreEventNames.ADDED:
      case StoreEventNames.UPDATING:
      case StoreEventNames.UPDATED:
      case StoreEventNames.DELETING:
      case StoreEventNames.DELETED:
      case 'onAppointmentFormOpening':
      case 'onAppointmentTooltipShowing':
        this._actions[name] = this._createActionByOption(name);
        break;
      case 'onAppointmentRendered':
        this._appointments.option('onItemRendered', this._getAppointmentRenderedAction());
        break;
      case 'onAppointmentClick':
        this._appointments.option('onItemClick', this._createActionByOption(name));
        break;
      case 'onAppointmentDblClick':
        this._appointments.option(name, this._createActionByOption(name));
        break;
      case 'onAppointmentContextMenu':
        this._appointments.option('onItemContextMenu', this._createActionByOption(name));
        this._appointmentTooltip._options.onItemContextMenu = this._createActionByOption(name);
        break;
      case 'noDataText':
      case 'allowMultipleCellSelection':
      case 'selectedCellData':
      case 'accessKey':
      case 'onCellClick':
        this._workSpace.option(name, value);
        break;
      case 'onCellContextMenu':
        this._workSpace.option(name, value);
        break;
      case 'crossScrollingEnabled':
        this._postponeResourceLoading().done(resources => {
          this._appointments.option('items', []);
          this._refreshWorkSpace(resources);
          if (this._readyToRenderAppointments) {
            this._appointments.option('items', this._getAppointmentsToRepaint());
          }
        });
        break;
      case 'cellDuration':
        this._updateOption('workSpace', name, value);
        this._appointments.option('items', []);
        if (this._readyToRenderAppointments) {
          this._updateOption('workSpace', 'hoursInterval', value / 60);
          this._appointments.option('items', this._getAppointmentsToRepaint());
        }
        break;
      case 'tabIndex':
      case 'focusStateEnabled':
        this._updateOption('header', name, value);
        this._updateOption('workSpace', name, value);
        this._appointments.option(name, value);
        // @ts-expect-error
        _Widget.prototype._optionChanged.call(this, args);
        break;
      case 'width':
        // TODO: replace with css
        this._updateOption('header', name, value);
        if (this.option('crossScrollingEnabled')) {
          this._updateOption('workSpace', 'width', value);
        }
        this._updateOption('workSpace', 'schedulerWidth', value);
        // @ts-expect-error
        _Widget.prototype._optionChanged.call(this, args);
        this._dimensionChanged(null, true);
        break;
      case 'height':
        // @ts-expect-error
        _Widget.prototype._optionChanged.call(this, args);
        this._dimensionChanged(null, true);
        this._updateOption('workSpace', 'schedulerHeight', value);
        break;
      case 'editing':
        {
          this._initEditing();
          const editing = this._editing;
          this._bringEditingModeToAppointments(editing);
          this.hideAppointmentTooltip();
          this._cleanPopup();
          break;
        }
      case 'showAllDayPanel':
        this.updateInstances();
        this.repaint();
        break;
      case 'showCurrentTimeIndicator':
      case 'indicatorTime':
      case 'indicatorUpdateInterval':
      case 'shadeUntilCurrentTime':
      case 'groupByDate':
        this._updateOption('workSpace', name, value);
        this.repaint();
        break;
      case 'appointmentDragging':
      case 'appointmentTooltipTemplate':
      case 'appointmentPopupTemplate':
      case 'recurrenceEditMode':
      case 'remoteFiltering':
      case 'timeZone':
        this.updateInstances();
        this.repaint();
        break;
      case 'dropDownAppointmentTemplate':
      case 'appointmentCollectorTemplate':
      case '_appointmentTooltipOffset':
      case '_appointmentTooltipButtonsPosition':
      case '_appointmentTooltipOpenButtonText':
      case '_appointmentCountPerCell':
      case '_collectorOffset':
      case '_appointmentOffset':
        this.repaint();
        break;
      case 'dateSerializationFormat':
        break;
      case 'maxAppointmentsPerCell':
        break;
      case 'startDateExpr':
      case 'endDateExpr':
      case 'startDateTimeZoneExpr':
      case 'endDateTimeZoneExpr':
      case 'textExpr':
      case 'descriptionExpr':
      case 'allDayExpr':
      case 'recurrenceRuleExpr':
      case 'recurrenceExceptionExpr':
      case 'disabledExpr':
        this._updateExpression(name, value);
        this.appointmentDataProvider.updateDataAccessors(this._dataAccessors);
        this._initAppointmentTemplate();
        this.repaint();
        break;
      case 'adaptivityEnabled':
        this._toggleAdaptiveClass();
        this.repaint();
        break;
      case 'scrolling':
        this.option('crossScrollingEnabled', this._isHorizontalVirtualScrolling() || this.option('crossScrollingEnabled'));
        this._updateOption('workSpace', args.fullName, value);
        break;
      case 'allDayPanelMode':
        this.updateInstances();
        this._updateOption('workSpace', args.fullName, value);
        break;
      case 'renovateRender':
        this._updateOption('workSpace', name, value);
        break;
      case '_draggingMode':
        this._workSpace.option('draggingMode', value);
        break;
      case 'toolbar':
        this._header ? this._header.option('items', value) : this.repaint();
        break;
      case 'loadedResources':
      case 'resourceLoaderMap':
        break;
      default:
        // @ts-expect-error
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto._dateOption = function _dateOption(optionName) {
    const optionValue = this._getCurrentViewOption(optionName);
    return _date_serialization.default.deserializeDate(optionValue);
  };
  _proto._getSerializationFormat = function _getSerializationFormat(optionName) {
    const value = this._getCurrentViewOption(optionName);
    if (typeof value === 'number') {
      return 'number';
    }
    if (!(0, _type.isString)(value)) {
      return;
    }
    return _date_serialization.default.getDateSerializationFormat(value);
  };
  _proto._bringEditingModeToAppointments = function _bringEditingModeToAppointments(editing) {
    const editingConfig = {
      allowDelete: editing.allowUpdating && editing.allowDeleting
    };
    if (!this._isAgenda()) {
      editingConfig.allowDrag = editing.allowDragging;
      editingConfig.allowResize = editing.allowResizing;
      editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing();
    }
    this._appointments.option(editingConfig);
    this.repaint();
  };
  _proto._isAgenda = function _isAgenda() {
    return this.getLayoutManager().appointmentRenderingStrategyName === 'agenda';
  };
  _proto._allowDragging = function _allowDragging() {
    return this._editing.allowDragging && !this._isAgenda();
  };
  _proto._allowResizing = function _allowResizing() {
    return this._editing.allowResizing && !this._isAgenda();
  };
  _proto._allowAllDayResizing = function _allowAllDayResizing() {
    return this._editing.allowResizing && this._supportAllDayResizing();
  };
  _proto._supportAllDayResizing = function _supportAllDayResizing() {
    // @ts-expect-error
    return this.currentViewType !== 'day' || this.currentView.intervalCount > 1;
  };
  _proto._isAllDayExpanded = function _isAllDayExpanded() {
    return this.option('showAllDayPanel') && this.appointmentDataProvider.hasAllDayAppointments(this.filteredItems, this.preparedItems);
  };
  _proto._getTimezoneOffsetByOption = function _getTimezoneOffsetByOption(date) {
    return _m_utils_time_zone.default.calculateTimezoneByValue(this.option('timeZone'), date);
  };
  _proto._filterAppointmentsByDate = function _filterAppointmentsByDate() {
    const dateRange = this._workSpace.getDateRange();
    const startDate = this.timeZoneCalculator.createDate(dateRange[0], {
      path: 'fromGrid'
    });
    const endDate = this.timeZoneCalculator.createDate(dateRange[1], {
      path: 'fromGrid'
    });
    this.appointmentDataProvider.filterByDate(startDate, endDate, this.option('remoteFiltering'), this.option('dateSerializationFormat'));
  };
  _proto._reloadDataSource = function _reloadDataSource() {
    // @ts-expect-error
    const result = new _deferred.Deferred();
    if (this._dataSource) {
      this._dataSource.load().done(() => {
        (0, _m_loading.hide)();
        this._fireContentReadyAction(result);
      }).fail(() => {
        (0, _m_loading.hide)();
        result.reject();
      });
      this._dataSource.isLoading() && (0, _m_loading.show)({
        container: this.$element(),
        position: {
          of: this.$element()
        }
      });
    } else {
      this._fireContentReadyAction(result);
    }
    return result.promise();
  };
  _proto._fireContentReadyAction = function _fireContentReadyAction(result) {
    var _a;
    // @ts-expect-error
    const contentReadyBase = _Widget.prototype._fireContentReadyAction.bind(this);
    const fireContentReady = () => {
      contentReadyBase();
      result === null || result === void 0 ? void 0 : result.resolve();
    };
    if (this._workSpaceRecalculation) {
      (_a = this._workSpaceRecalculation) === null || _a === void 0 ? void 0 : _a.done(() => {
        fireContentReady();
      });
    } else {
      fireContentReady();
    }
  };
  _proto._dimensionChanged = function _dimensionChanged(value) {
    let isForce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const isFixedHeight = typeof this.option('height') === 'number';
    const isFixedWidth = typeof this.option('width') === 'number';
    // @ts-expect-error
    if (!this._isVisible()) {
      return;
    }
    this._toggleSmallClass();
    const workspace = this.getWorkSpace();
    if (!this._isAgenda() && this.filteredItems && workspace) {
      if (isForce || !isFixedHeight || !isFixedWidth) {
        workspace.option('allDayExpanded', this._isAllDayExpanded());
        workspace._dimensionChanged();
        const appointments = this.getLayoutManager().createAppointmentsMap(this.filteredItems);
        this._appointments.option('items', appointments);
      }
    }
    this.hideAppointmentTooltip();
    // TODO popup
    this._appointmentPopup.triggerResize();
    this._appointmentPopup.updatePopupFullScreenMode();
  };
  _proto._clean = function _clean() {
    this._cleanPopup();
    // @ts-expect-error
    _Widget.prototype._clean.call(this);
  };
  _proto._toggleSmallClass = function _toggleSmallClass() {
    const {
      width
    } = (0, _position.getBoundingRect)(this.$element().get(0));
    this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
  };
  _proto._toggleAdaptiveClass = function _toggleAdaptiveClass() {
    this.$element().toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
  };
  _proto._visibilityChanged = function _visibilityChanged(visible) {
    visible && this._dimensionChanged(null, true);
  };
  _proto._dataSourceOptions = function _dataSourceOptions() {
    return {
      paginate: false
    };
  };
  _proto._initAllDayPanel = function _initAllDayPanel() {
    if (this.option('allDayPanelMode') === 'hidden') {
      this.option('showAllDayPanel', false);
    }
  };
  _proto._init = function _init() {
    this._initExpressions({
      startDate: this.option('startDateExpr'),
      endDate: this.option('endDateExpr'),
      startDateTimeZone: this.option('startDateTimeZoneExpr'),
      endDateTimeZone: this.option('endDateTimeZoneExpr'),
      allDay: this.option('allDayExpr'),
      text: this.option('textExpr'),
      description: this.option('descriptionExpr'),
      recurrenceRule: this.option('recurrenceRuleExpr'),
      recurrenceException: this.option('recurrenceExceptionExpr'),
      disabled: this.option('disabledExpr')
    });
    // @ts-expect-error
    _Widget.prototype._init.call(this);
    this._initAllDayPanel();
    // @ts-expect-error
    this._initDataSource();
    this._customizeDataSourceLoadOptions();
    this.$element().addClass(WIDGET_CLASS);
    this._initEditing();
    this.updateInstances();
    this._initActions();
    this._compactAppointmentsHelper = new _m_compact_appointments_helper.CompactAppointmentsHelper(this);
    this._asyncTemplatesTimers = [];
    this._dataSourceLoadedCallback = (0, _callbacks.default)();
    this._subscribes = _m_subscribes.default;
    this.agendaResourceProcessor = new _m_agenda_resource_processor.AgendaResourceProcessor(this.option('resources'));
    this._optionsValidator = new _index3.SchedulerOptionsValidator();
    this._optionsValidatorErrorHandler = new _index3.SchedulerOptionsValidatorErrorsHandler();
  };
  _proto.createAppointmentDataProvider = function createAppointmentDataProvider() {
    var _a;
    (_a = this.appointmentDataProvider) === null || _a === void 0 ? void 0 : _a.destroy();
    this.appointmentDataProvider = new _m_appointment_data_provider.AppointmentDataProvider({
      dataSource: this._dataSource,
      dataAccessors: this._dataAccessors,
      timeZoneCalculator: this.timeZoneCalculator,
      dateSerializationFormat: this.option('dateSerializationFormat'),
      resources: this.option('resources'),
      startDayHour: this._getCurrentViewOption('startDayHour'),
      endDayHour: this._getCurrentViewOption('endDayHour'),
      viewOffset: this.getViewOffsetMs(),
      appointmentDuration: this._getCurrentViewOption('cellDuration'),
      allDayPanelMode: this._getCurrentViewOption('allDayPanelMode'),
      showAllDayPanel: this.option('showAllDayPanel'),
      getLoadedResources: () => this.option('loadedResources'),
      getIsVirtualScrolling: () => this.isVirtualScrolling(),
      getSupportAllDayRow: () => this._workSpace.supportAllDayRow(),
      getViewType: () => this._workSpace.type,
      getViewDirection: () => this._workSpace.viewDirection,
      getDateRange: () => this._workSpace.getDateRange(),
      getGroupCount: () => this._workSpace._getGroupCount(),
      getViewDataProvider: () => this._workSpace.viewDataProvider
    });
  };
  _proto.updateInstances = function updateInstances() {
    this._timeZoneCalculator = null;
    if (this.getWorkSpace()) {
      this.createAppointmentDataProvider();
    }
  };
  _proto._customizeDataSourceLoadOptions = function _customizeDataSourceLoadOptions() {
    var _a;
    (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.on('customizeStoreLoadOptions', _ref => {
      let {
        storeLoadOptions
      } = _ref;
      storeLoadOptions.startDate = this.getStartViewDate();
      storeLoadOptions.endDate = this.getEndViewDate();
    });
  };
  _proto._initTemplates = function _initTemplates() {
    this._initAppointmentTemplate();
    this._templateManager.addDefaultTemplates({
      appointmentTooltip: new _empty_template.EmptyTemplate(),
      dropDownAppointment: new _empty_template.EmptyTemplate()
    });
    // @ts-expect-error
    _Widget.prototype._initTemplates.call(this);
  };
  _proto._initAppointmentTemplate = function _initAppointmentTemplate() {
    const {
      expr
    } = this._dataAccessors;
    const createGetter = property => (0, _data.compileGetter)("appointmentData.".concat(property));
    const getDate = getter => data => {
      const value = getter(data);
      if (value instanceof Date) {
        return value.valueOf();
      }
      return value;
    };
    this._templateManager.addDefaultTemplates({
      item: new _bindable_template.BindableTemplate(($container, data, model) => this.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model), ['html', 'text', 'startDate', 'endDate', 'allDay', 'description', 'recurrenceRule', 'recurrenceException', 'startDateTimeZone', 'endDateTimeZone'], this.option('integrationOptions.watchMethod'), {
        text: createGetter(expr.textExpr),
        startDate: getDate(createGetter(expr.startDateExpr)),
        endDate: getDate(createGetter(expr.endDateExpr)),
        startDateTimeZone: createGetter(expr.startDateTimeZoneExpr),
        endDateTimeZone: createGetter(expr.endDateTimeZoneExpr),
        allDay: createGetter(expr.allDayExpr),
        recurrenceRule: createGetter(expr.recurrenceRuleExpr)
      })
    });
  };
  _proto._renderContent = function _renderContent() {
    // @ts-expect-error
    this._renderContentImpl();
  };
  _proto._updatePreparedItems = function _updatePreparedItems(items) {
    this.preparedItems = (0, _index2.getPreparedDataItems)(items, this._dataAccessors, this._getCurrentViewOption('cellDuration'), this.timeZoneCalculator);
  };
  _proto._dataSourceChangedHandler = function _dataSourceChangedHandler(result) {
    if (this._readyToRenderAppointments) {
      this._workSpaceRecalculation.done(() => {
        this._updatePreparedItems(result);
        this._renderAppointments();
        this.getWorkSpace().onDataSourceChanged(this.filteredItems);
      });
    }
  };
  _proto.isVirtualScrolling = function isVirtualScrolling() {
    var _a;
    const workspace = this.getWorkSpace();
    if (workspace) {
      return workspace.isVirtualScrolling();
    }
    const currentViewOptions = this._getCurrentViewOptions();
    const scrolling = this.option('scrolling');
    return (scrolling === null || scrolling === void 0 ? void 0 : scrolling.mode) === 'virtual' || ((_a = currentViewOptions === null || currentViewOptions === void 0 ? void 0 : currentViewOptions.scrolling) === null || _a === void 0 ? void 0 : _a.mode) === 'virtual';
  };
  _proto._filterAppointments = function _filterAppointments() {
    this.filteredItems = this.appointmentDataProvider.filter(this.preparedItems);
  };
  _proto._renderAppointments = function _renderAppointments() {
    const workspace = this.getWorkSpace();
    this._filterAppointments();
    workspace.option('allDayExpanded', this._isAllDayExpanded());
    let viewModel = [];
    // @ts-expect-error
    if (this._isVisible()) {
      viewModel = this._getAppointmentsToRepaint();
    }
    this._appointments.option('items', viewModel);
    this.appointmentDataProvider.cleanState();
  };
  _proto._getAppointmentsToRepaint = function _getAppointmentsToRepaint() {
    const layoutManager = this.getLayoutManager();
    const appointmentsMap = layoutManager.createAppointmentsMap(this.filteredItems);
    return layoutManager.getRepaintedAppointments(appointmentsMap, this.getAppointmentsInstance().option('items'));
  };
  _proto._initExpressions = function _initExpressions(fields) {
    this._dataAccessors = _m_utils.utils.dataAccessors.create(fields, this._dataAccessors, (0, _config.default)().forceIsoDateParsing, this.option('dateSerializationFormat'));
    this._dataAccessors.resources = (0, _m_utils2.createExpressions)(this.option('resources'));
  };
  _proto._updateExpression = function _updateExpression(name, value) {
    const exprObj = {};
    exprObj[name.replace('Expr', '')] = value;
    this._initExpressions(exprObj);
  };
  _proto.getResourceDataAccessors = function getResourceDataAccessors() {
    return this._dataAccessors.resources;
  };
  _proto._initEditing = function _initEditing() {
    const editing = this.option('editing');
    this._editing = {
      allowAdding: !!editing,
      allowUpdating: !!editing,
      allowDeleting: !!editing,
      allowResizing: !!editing,
      allowDragging: !!editing
    };
    if ((0, _type.isObject)(editing)) {
      this._editing = (0, _extend.extend)(this._editing, editing);
    }
    this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
    this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;
    this.$element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly());
  };
  _proto._isReadOnly = function _isReadOnly() {
    let result = true;
    const editing = this._editing;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in editing) {
      if (Object.prototype.hasOwnProperty.call(editing, prop)) {
        result = result && !editing[prop];
      }
    }
    return result;
  };
  _proto._dispose = function _dispose() {
    var _a;
    this._appointmentTooltip && this._appointmentTooltip.dispose();
    (_a = this._recurrenceDialog) === null || _a === void 0 ? void 0 : _a.hide(RECURRENCE_EDITING_MODE.CANCEL);
    this.hideAppointmentPopup();
    this.hideAppointmentTooltip();
    this._asyncTemplatesTimers.forEach(clearTimeout);
    this._asyncTemplatesTimers = [];
    // @ts-expect-error
    _Widget.prototype._dispose.call(this);
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onAppointmentAdding: this._createActionByOption(StoreEventNames.ADDING),
      onAppointmentAdded: this._createActionByOption(StoreEventNames.ADDED),
      onAppointmentUpdating: this._createActionByOption(StoreEventNames.UPDATING),
      onAppointmentUpdated: this._createActionByOption(StoreEventNames.UPDATED),
      onAppointmentDeleting: this._createActionByOption(StoreEventNames.DELETING),
      onAppointmentDeleted: this._createActionByOption(StoreEventNames.DELETED),
      onAppointmentFormOpening: this._createActionByOption('onAppointmentFormOpening'),
      onAppointmentTooltipShowing: this._createActionByOption('onAppointmentTooltipShowing')
    };
  };
  _proto._getAppointmentRenderedAction = function _getAppointmentRenderedAction() {
    return this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };
  _proto._renderFocusTarget = function _renderFocusTarget() {
    return (0, _common.noop)();
  };
  _proto._initMarkup = function _initMarkup() {
    // @ts-expect-error
    _Widget.prototype._initMarkup.call(this);
    this._renderMainContainer();
    this._renderHeader();
    this._layoutManager = new _m_appointments_layout_manager.default(this);
    // @ts-expect-error
    this._appointments = this._createComponent('<div>', _m_appointment_collection.default, this._appointmentsConfig());
    this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));
    this._appointmentTooltip = new (this.option('adaptivityEnabled') ? _m_mobile_tooltip_strategy.MobileTooltipStrategy : _m_desktop_tooltip_strategy.DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());
    this._createAppointmentPopupForm();
    // @ts-expect-error
    if (this._isDataSourceLoaded() || this._isDataSourceLoading()) {
      this._initMarkupCore(this.option('loadedResources'));
      this._dataSourceChangedHandler(this._dataSource.items());
      this._fireContentReadyAction();
    } else {
      const groups = this._getCurrentViewOption('groups');
      (0, _m_utils2.loadResources)(groups, this.option('resources'), this.option('resourceLoaderMap')).done(resources => {
        this.option('loadedResources', resources);
        this._initMarkupCore(resources);
        this._reloadDataSource();
      });
    }
  };
  _proto._createAppointmentPopupForm = function _createAppointmentPopupForm() {
    var _a, _b;
    if (this._appointmentForm) {
      (_a = this._appointmentForm.form) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    this._appointmentForm = this.createAppointmentForm();
    (_b = this._appointmentPopup) === null || _b === void 0 ? void 0 : _b.dispose();
    this._appointmentPopup = this.createAppointmentPopup(this._appointmentForm);
  };
  _proto._renderMainContainer = function _renderMainContainer() {
    this._mainContainer = (0, _renderer.default)('<div>').addClass('dx-scheduler-container');
    this.$element().append(this._mainContainer);
  };
  _proto.createAppointmentForm = function createAppointmentForm() {
    const scheduler = {
      createResourceEditorModel: () => (0, _m_utils2.createResourceEditorModel)(this.option('resources'), this.option('loadedResources')),
      getDataAccessors: () => this._dataAccessors,
      // @ts-expect-error
      createComponent: (element, component, options) => this._createComponent(element, component, options),
      getEditingConfig: () => this._editing,
      getFirstDayOfWeek: () => this.option('firstDayOfWeek'),
      getStartDayHour: () => this.option('startDayHour'),
      getCalculatedEndDate: startDateWithStartHour => this._workSpace.calculateEndDate(startDateWithStartHour),
      getTimeZoneCalculator: () => this.timeZoneCalculator
    };
    return new _m_form.AppointmentForm(scheduler);
  };
  _proto.createAppointmentPopup = function createAppointmentPopup(form) {
    const scheduler = {
      getElement: () => this.$element(),
      // @ts-expect-error
      createComponent: (element, component, options) => this._createComponent(element, component, options),
      focus: () => this.focus(),
      getResources: () => this.option('resources'),
      getEditingConfig: () => this._editing,
      getTimeZoneCalculator: () => this.timeZoneCalculator,
      getDataAccessors: () => this._dataAccessors,
      getAppointmentFormOpening: () => this._actions.onAppointmentFormOpening,
      processActionResult: (arg, canceled) => this._processActionResult(arg, canceled),
      addAppointment: appointment => this.addAppointment(appointment),
      updateAppointment: (sourceAppointment, updatedAppointment) => this.updateAppointment(sourceAppointment, updatedAppointment),
      updateScrollPosition: (startDate, resourceItem, inAllDayRow) => {
        this._workSpace.updateScrollPosition(startDate, resourceItem, inAllDayRow);
      }
    };
    return new _m_popup.AppointmentPopup(scheduler, form);
  };
  _proto._getAppointmentTooltipOptions = function _getAppointmentTooltipOptions() {
    const that = this;
    return {
      // @ts-expect-error
      createComponent: that._createComponent.bind(that),
      container: that.$element(),
      getScrollableContainer: that.getWorkSpaceScrollableContainer.bind(that),
      addDefaultTemplates: that._templateManager.addDefaultTemplates.bind(that._templateManager),
      getAppointmentTemplate: that._getAppointmentTemplate.bind(that),
      showAppointmentPopup: that.showAppointmentPopup.bind(that),
      checkAndDeleteAppointment: that.checkAndDeleteAppointment.bind(that),
      isAppointmentInAllDayPanel: that.isAppointmentInAllDayPanel.bind(that),
      createFormattedDateText: (appointment, targetedAppointment, format) => this.fire('getTextAndFormatDate', appointment, targetedAppointment, format),
      getAppointmentDisabled: appointment => (0, _m_appointment_adapter.createAppointmentAdapter)(appointment, this._dataAccessors, this.timeZoneCalculator).disabled,
      onItemContextMenu: that._createActionByOption('onAppointmentContextMenu'),
      createEventArgs: that._createEventArgs.bind(that)
    };
  };
  _proto._createEventArgs = function _createEventArgs(e) {
    const config = {
      itemData: e.itemData.appointment,
      itemElement: e.itemElement,
      targetedAppointment: e.itemData.targetedAppointment
    };
    return (0, _extend.extend)({}, this.fire('mapAppointmentFields', config), {
      component: e.component,
      element: e.element,
      event: e.event,
      model: e.model
    });
  };
  _proto.checkAndDeleteAppointment = function checkAndDeleteAppointment(appointment, targetedAppointment) {
    const targetedAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(targetedAppointment, this._dataAccessors, this.timeZoneCalculator);
    const deletingOptions = this.fireOnAppointmentDeleting(appointment, targetedAdapter);
    this._checkRecurringAppointment(appointment, targetedAppointment, targetedAdapter.startDate, () => {
      this.processDeleteAppointment(appointment, deletingOptions);
    }, true);
  };
  _proto._getExtraAppointmentTooltipOptions = function _getExtraAppointmentTooltipOptions() {
    return {
      rtlEnabled: this.option('rtlEnabled'),
      focusStateEnabled: this.option('focusStateEnabled'),
      editing: this.option('editing'),
      offset: this.option('_appointmentTooltipOffset')
    };
  };
  _proto.isAppointmentInAllDayPanel = function isAppointmentInAllDayPanel(appointmentData) {
    const workSpace = this._workSpace;
    const itTakesAllDay = this.appointmentTakesAllDay(appointmentData);
    return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option('showAllDayPanel');
  };
  _proto._initMarkupCore = function _initMarkupCore(resources) {
    this._readyToRenderAppointments = (0, _window.hasWindow)();
    this._workSpace && this._cleanWorkspace();
    this._renderWorkSpace(resources);
    this._appointments.option({
      fixedContainer: this._workSpace.getFixedContainer(),
      allDayContainer: this._workSpace.getAllDayContainer()
    });
    this._waitAsyncTemplate(() => {
      var _a;
      return (_a = this._workSpaceRecalculation) === null || _a === void 0 ? void 0 : _a.resolve();
    });
    this.createAppointmentDataProvider();
    this._filterAppointmentsByDate();
    this._validateKeyFieldIfAgendaExist();
  };
  _proto._isDataSourceLoaded = function _isDataSourceLoaded() {
    return this._dataSource && this._dataSource.isLoaded();
  };
  _proto._render = function _render() {
    var _a;
    // NOTE: remove small class applying after adaptivity implementation
    this._toggleSmallClass();
    this._toggleAdaptiveClass();
    (_a = this.getWorkSpace()) === null || _a === void 0 ? void 0 : _a.updateHeaderEmptyCellWidth();
    // @ts-expect-error
    _Widget.prototype._render.call(this);
  };
  _proto._renderHeader = function _renderHeader() {
    if (this.option('toolbar').length !== 0) {
      const $header = (0, _renderer.default)('<div>').appendTo(this._mainContainer);
      // @ts-expect-error
      this._header = this._createComponent($header, _m_header.SchedulerHeader, this._headerConfig());
    }
  };
  _proto._headerConfig = function _headerConfig() {
    const currentViewOptions = this._getCurrentViewOptions();
    const countConfig = this._getViewCountConfig();
    const result = (0, _extend.extend)({
      firstDayOfWeek: this.getFirstDayOfWeek(),
      currentView: this.option('currentView'),
      isAdaptive: this.option('adaptivityEnabled'),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      rtlEnabled: this.option('rtlEnabled'),
      useDropDownViewSwitcher: this.option('useDropDownViewSwitcher'),
      customizeDateNavigatorText: this.option('customizeDateNavigatorText'),
      agendaDuration: currentViewOptions.agendaDuration || DEFAULT_AGENDA_DURATION
    }, currentViewOptions);
    result.intervalCount = countConfig.intervalCount;
    result.views = this.option('views');
    result.min = new Date(this._dateOption('min'));
    result.max = new Date(this._dateOption('max'));
    result.currentDate = _date.default.trimTime(new Date(this._dateOption('currentDate')));
    result.onCurrentViewChange = name => {
      this.option('currentView', name);
    };
    result.onCurrentDateChange = date => {
      this.option('currentDate', date);
    };
    result.items = this.option('toolbar');
    result.startViewDate = this.getStartViewDate();
    result.todayDate = () => {
      const result = this.timeZoneCalculator.createDate(new Date(), {
        path: 'toGrid'
      });
      return result;
    };
    return result;
  };
  _proto._appointmentsConfig = function _appointmentsConfig() {
    const config = {
      getResources: () => this.option('resources'),
      getResourceDataAccessors: this.getResourceDataAccessors.bind(this),
      getAgendaResourceProcessor: () => this.agendaResourceProcessor,
      getAppointmentColor: this.createGetAppointmentColor(),
      getAppointmentDataProvider: () => this.appointmentDataProvider,
      dataAccessors: this._dataAccessors,
      observer: this,
      onItemRendered: this._getAppointmentRenderedAction(),
      onItemClick: this._createActionByOption('onAppointmentClick'),
      onItemContextMenu: this._createActionByOption('onAppointmentContextMenu'),
      onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick'),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      allowDrag: this._allowDragging(),
      allowDelete: this._editing.allowUpdating && this._editing.allowDeleting,
      allowResize: this._allowResizing(),
      allowAllDayResize: this._allowAllDayResizing(),
      rtlEnabled: this.option('rtlEnabled'),
      currentView: this.currentView,
      groups: this._getCurrentViewOption('groups'),
      timeZoneCalculator: this.timeZoneCalculator,
      getResizableStep: () => this._workSpace ? this._workSpace.positionHelper.getResizableStep() : 0,
      getDOMElementsMetaData: () => {
        var _a;
        return (_a = this._workSpace) === null || _a === void 0 ? void 0 : _a.getDOMElementsMetaData();
      },
      getViewDataProvider: () => {
        var _a;
        return (_a = this._workSpace) === null || _a === void 0 ? void 0 : _a.viewDataProvider;
      },
      isVerticalViewDirection: () => this.getRenderingStrategyInstance().getDirection() === 'vertical',
      isVerticalGroupedWorkSpace: () => this._workSpace._isVerticalGroupedWorkSpace(),
      isDateAndTimeView: () => (0, _index2.isDateAndTimeView)(this._workSpace.type),
      onContentReady: () => {
        var _a;
        (_a = this._workSpace) === null || _a === void 0 ? void 0 : _a.option('allDayExpanded', this._isAllDayExpanded());
      }
    };
    return config;
  };
  _proto.getCollectorOffset = function getCollectorOffset() {
    if (this._workSpace.needApplyCollectorOffset() && !this.option('adaptivityEnabled')) {
      return this.option('_collectorOffset');
    }
    return 0;
  };
  _proto.getAppointmentDurationInMinutes = function getAppointmentDurationInMinutes() {
    return this._getCurrentViewOption('cellDuration');
  };
  _proto._getCurrentViewType = function _getCurrentViewType() {
    return this.currentViewType;
  };
  _proto._renderWorkSpace = function _renderWorkSpace(groups) {
    var _a;
    this._readyToRenderAppointments && this._toggleSmallClass();
    const $workSpace = (0, _renderer.default)('<div>').appendTo(this._mainContainer);
    const countConfig = this._getViewCountConfig();
    const workSpaceComponent = VIEWS_CONFIG[this._getCurrentViewType()].workSpace;
    const workSpaceConfig = this._workSpaceConfig(groups, countConfig);
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);
    this._allowDragging() && this._workSpace.initDragBehavior(this, this._all);
    this._workSpace._attachTablesEvents();
    this._workSpace.getWorkArea().append(this._appointments.$element());
    this._recalculateWorkspace();
    countConfig.startDate && ((_a = this._header) === null || _a === void 0 ? void 0 : _a.option('currentDate', this._workSpace._getHeaderDate()));
    this._appointments.option('_collectorOffset', this.getCollectorOffset());
  };
  _proto._getViewCountConfig = function _getViewCountConfig() {
    const currentView = this.option('currentView');
    const view = this._getViewByName(currentView);
    const viewCount = view && view.intervalCount || 1;
    const startDate = view && view.startDate || null;
    return {
      intervalCount: viewCount,
      startDate
    };
  };
  _proto._getViewByName = function _getViewByName(name) {
    const views = this.option('views');
    for (let i = 0; i < views.length; i++) {
      if (views[i].name === name || views[i].type === name || views[i] === name) return views[i];
    }
  };
  _proto._recalculateWorkspace = function _recalculateWorkspace() {
    // @ts-expect-error
    this._workSpaceRecalculation = new _deferred.Deferred();
    this._waitAsyncTemplate(() => {
      (0, _visibility_change.triggerResizeEvent)(this._workSpace.$element());
      this._workSpace.renderCurrentDateTimeLineAndShader();
    });
  };
  _proto._workSpaceConfig = function _workSpaceConfig(groups, countConfig) {
    var _a;
    const currentViewOptions = this._getCurrentViewOptions();
    const scrolling = this.option('scrolling');
    const isVirtualScrolling = scrolling.mode === 'virtual' || ((_a = currentViewOptions.scrolling) === null || _a === void 0 ? void 0 : _a.mode) === 'virtual';
    const horizontalVirtualScrollingAllowed = isVirtualScrolling && (!(0, _type.isDefined)(scrolling.orientation) || ['horizontal', 'both'].filter(item => {
      var _a;
      return scrolling.orientation === item || ((_a = currentViewOptions.scrolling) === null || _a === void 0 ? void 0 : _a.orientation) === item;
    }).length > 0);
    const crossScrollingEnabled = this.option('crossScrollingEnabled') || horizontalVirtualScrollingAllowed || (0, _index2.isTimelineView)(this.currentViewType);
    const result = (0, _extend.extend)({
      resources: this.option('resources'),
      loadedResources: this.option('loadedResources'),
      getFilteredItems: () => this.filteredItems,
      getResourceDataAccessors: this.getResourceDataAccessors.bind(this),
      noDataText: this.option('noDataText'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      viewOffset: this.getViewOffsetMs(),
      tabIndex: this.option('tabIndex'),
      accessKey: this.option('accessKey'),
      focusStateEnabled: this.option('focusStateEnabled'),
      cellDuration: this.option('cellDuration'),
      showAllDayPanel: this.option('showAllDayPanel'),
      showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),
      indicatorTime: this.option('indicatorTime'),
      indicatorUpdateInterval: this.option('indicatorUpdateInterval'),
      shadeUntilCurrentTime: this.option('shadeUntilCurrentTime'),
      allDayExpanded: this._appointments.option('items'),
      crossScrollingEnabled,
      dataCellTemplate: this.option('dataCellTemplate'),
      timeCellTemplate: this.option('timeCellTemplate'),
      resourceCellTemplate: this.option('resourceCellTemplate'),
      dateCellTemplate: this.option('dateCellTemplate'),
      allowMultipleCellSelection: this.option('allowMultipleCellSelection'),
      selectedCellData: this.option('selectedCellData'),
      onSelectionChanged: args => {
        this.option('selectedCellData', args.selectedCellData);
      },
      groupByDate: this._getCurrentViewOption('groupByDate'),
      scrolling,
      draggingMode: this.option('_draggingMode'),
      timeZoneCalculator: this.timeZoneCalculator,
      schedulerHeight: this.option('height'),
      schedulerWidth: this.option('width'),
      allDayPanelMode: this.option('allDayPanelMode'),
      onSelectedCellsClick: this.showAddAppointmentPopup.bind(this),
      onRenderAppointments: this._renderAppointments.bind(this),
      onShowAllDayPanel: value => this.option('showAllDayPanel', value),
      getHeaderHeight: () => _m_utils.utils.DOM.getHeaderHeight(this._header),
      onScrollEnd: () => this._appointments.updateResizableArea(),
      // TODO: SSR does not work correctly with renovated render
      renovateRender: this._isRenovatedRender(isVirtualScrolling)
    }, currentViewOptions);
    result.observer = this;
    result.intervalCount = countConfig.intervalCount;
    result.startDate = countConfig.startDate;
    result.groups = groups;
    result.onCellClick = this._createActionByOption('onCellClick');
    result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
    result.currentDate = _date.default.trimTime(new Date(this._dateOption('currentDate')));
    result.hoursInterval = result.cellDuration / 60;
    result.allDayExpanded = false;
    result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
    result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
    result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
    result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;
    result.getAppointmentDataProvider = () => this.appointmentDataProvider;
    return result;
  };
  _proto._isRenovatedRender = function _isRenovatedRender(isVirtualScrolling) {
    return this.option('renovateRender') && (0, _window.hasWindow)() || isVirtualScrolling;
  };
  _proto._waitAsyncTemplate = function _waitAsyncTemplate(callback) {
    if (this._options.silent('templatesRenderAsynchronously')) {
      const timer = setTimeout(() => {
        callback();
        clearTimeout(timer);
      });
      this._asyncTemplatesTimers.push(timer);
    } else {
      callback();
    }
  };
  _proto._getCurrentViewOptions = function _getCurrentViewOptions() {
    return this.currentView;
  };
  _proto._getCurrentViewOption = function _getCurrentViewOption(optionName) {
    if (this.currentView && this.currentView[optionName] !== undefined) {
      return this.currentView[optionName];
    }
    return this.option(optionName);
  };
  _proto._getAppointmentTemplate = function _getAppointmentTemplate(optionName) {
    const currentViewOptions = this._getCurrentViewOptions();
    if (currentViewOptions && currentViewOptions[optionName]) {
      return this._getTemplate(currentViewOptions[optionName]);
    }
    // @ts-expect-error
    return this._getTemplateByOption(optionName);
  };
  _proto._updateOption = function _updateOption(viewName, optionName, value) {
    const currentViewOptions = this._getCurrentViewOptions();
    if (!currentViewOptions || !(0, _type.isDefined)(currentViewOptions[optionName])) {
      this["_".concat(viewName)].option(optionName, value);
    }
  };
  _proto._refreshWorkSpace = function _refreshWorkSpace(groups) {
    this._cleanWorkspace();
    delete this._workSpace;
    this._renderWorkSpace(groups);
    if (this._readyToRenderAppointments) {
      this._appointments.option({
        fixedContainer: this._workSpace.getFixedContainer(),
        allDayContainer: this._workSpace.getAllDayContainer()
      });
      this._waitAsyncTemplate(() => this._workSpaceRecalculation.resolve());
    }
  };
  _proto._cleanWorkspace = function _cleanWorkspace() {
    this._appointments.$element().detach();
    this._workSpace._dispose();
    this._workSpace.$element().remove();
    this.option('selectedCellData', []);
  };
  _proto.getWorkSpaceScrollable = function getWorkSpaceScrollable() {
    return this._workSpace.getScrollable();
  };
  _proto.getWorkSpaceScrollableContainer = function getWorkSpaceScrollableContainer() {
    return this._workSpace.getScrollableContainer();
  };
  _proto.getWorkSpace = function getWorkSpace() {
    return this._workSpace;
  };
  _proto.getHeader = function getHeader() {
    return this._header;
  };
  _proto._cleanPopup = function _cleanPopup() {
    var _a;
    (_a = this._appointmentPopup) === null || _a === void 0 ? void 0 : _a.dispose();
  };
  _proto._checkRecurringAppointment = function _checkRecurringAppointment(rawAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing, dragEvent, recurrenceEditMode) {
    const recurrenceRule = _m_expression_utils.ExpressionUtils.getField(this._dataAccessors, 'recurrenceRule', rawAppointment);
    if (!(0, _m_recurrence.getRecurrenceProcessor)().evalRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
      callback();
      return;
    }
    const editMode = recurrenceEditMode || this.option('recurrenceEditMode');
    switch (editMode) {
      case 'series':
        callback();
        break;
      case 'occurrence':
        this._excludeAppointmentFromSeries(rawAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
        break;
      default:
        if (dragEvent) {
          // @ts-expect-error
          dragEvent.cancel = new _deferred.Deferred();
        }
        this._showRecurrenceChangeConfirm(isDeleted).done(editingMode => {
          editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();
          editingMode === RECURRENCE_EDITING_MODE.OCCURENCE && this._excludeAppointmentFromSeries(rawAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
        }).fail(() => this._appointments.moveAppointmentBack(dragEvent));
    }
  };
  _proto._excludeAppointmentFromSeries = function _excludeAppointmentFromSeries(rawAppointment, newRawAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
    const appointment = (0, _index2.excludeFromRecurrence)(rawAppointment, exceptionDate, this._dataAccessors, this._timeZoneCalculator);
    const singleRawAppointment = _extends({}, newRawAppointment);
    /* eslint-disable @typescript-eslint/no-dynamic-delete */
    delete singleRawAppointment[this._dataAccessors.expr.recurrenceExceptionExpr];
    delete singleRawAppointment[this._dataAccessors.expr.recurrenceRuleExpr];
    const keyPropertyName = this.appointmentDataProvider.keyName;
    delete singleRawAppointment[keyPropertyName];
    /* eslint-enable @typescript-eslint/no-dynamic-delete */
    const canCreateNewAppointment = !isDeleted && !isPopupEditing;
    if (canCreateNewAppointment) {
      this.addAppointment(singleRawAppointment);
    }
    if (isPopupEditing) {
      this._appointmentPopup.show(singleRawAppointment, {
        isToolbarVisible: true,
        action: _m_popup.ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES,
        excludeInfo: {
          sourceAppointment: rawAppointment,
          updatedAppointment: appointment.source()
        }
      });
      this._editAppointmentData = rawAppointment;
    } else {
      this._updateAppointment(rawAppointment, appointment.source(), () => {
        this._appointments.moveAppointmentBack(dragEvent);
      }, dragEvent);
    }
  };
  _proto._createRecurrenceException = function _createRecurrenceException(appointment, exceptionDate) {
    const result = [];
    if (appointment.recurrenceException) {
      result.push(appointment.recurrenceException);
    }
    result.push(this._getSerializedDate(exceptionDate, appointment.startDate, appointment.allDay));
    return result.join();
  };
  _proto._getSerializedDate = function _getSerializedDate(date, startDate, isAllDay) {
    isAllDay && date.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
    return _date_serialization.default.serializeDate(date, UTC_FULL_DATE_FORMAT);
  };
  _proto._showRecurrenceChangeConfirm = function _showRecurrenceChangeConfirm(isDeleted) {
    const title = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteTitle' : 'dxScheduler-confirmRecurrenceEditTitle');
    const message = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');
    const seriesText = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');
    const occurrenceText = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');
    this._recurrenceDialog = (0, _dialog.custom)({
      title,
      messageHtml: message,
      showCloseButton: true,
      showTitle: true,
      buttons: [{
        text: seriesText,
        onClick() {
          return RECURRENCE_EDITING_MODE.SERIES;
        }
      }, {
        text: occurrenceText,
        onClick() {
          return RECURRENCE_EDITING_MODE.OCCURENCE;
        }
      }],
      popupOptions: {
        wrapperAttr: {
          class: 'dx-dialog'
        }
      }
    });
    return this._recurrenceDialog.show();
  };
  _proto._getUpdatedData = function _getUpdatedData(rawAppointment) {
    const viewOffset = this.getViewOffsetMs();
    const getConvertedFromGrid = date => {
      if (!date) {
        return undefined;
      }
      const result = this.timeZoneCalculator.createDate(date, {
        path: 'fromGrid'
      });
      return _date3.dateUtilsTs.addOffsets(result, [-viewOffset]);
    };
    const isValidDate = date => !isNaN(new Date(date).getTime());
    const targetCell = this.getTargetCellData();
    const appointment = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    const cellStartDate = getConvertedFromGrid(targetCell.startDate);
    const cellEndDate = getConvertedFromGrid(targetCell.endDate);
    let appointmentStartDate = new Date(appointment.startDate);
    appointmentStartDate = _date3.dateUtilsTs.addOffsets(appointmentStartDate, [-viewOffset]);
    let appointmentEndDate = new Date(appointment.endDate);
    appointmentEndDate = _date3.dateUtilsTs.addOffsets(appointmentEndDate, [-viewOffset]);
    let resultedStartDate = cellStartDate !== null && cellStartDate !== void 0 ? cellStartDate : appointmentStartDate;
    if (!isValidDate(appointmentStartDate)) {
      appointmentStartDate = resultedStartDate;
    }
    if (!isValidDate(appointmentEndDate)) {
      appointmentEndDate = cellEndDate;
    }
    const duration = appointmentEndDate.getTime() - appointmentStartDate.getTime();
    const isKeepAppointmentHours = this._workSpace.keepOriginalHours() && isValidDate(appointment.startDate) && isValidDate(cellStartDate);
    if (isKeepAppointmentHours) {
      const startDate = this.timeZoneCalculator.createDate(appointmentStartDate, {
        path: 'toGrid'
      });
      const timeInMs = startDate.getTime() - _date.default.trimTime(startDate).getTime();
      const targetCellStartDate = _date3.dateUtilsTs.addOffsets(targetCell.startDate, [-viewOffset]);
      resultedStartDate = new Date(_date.default.trimTime(targetCellStartDate).getTime() + timeInMs);
      resultedStartDate = this.timeZoneCalculator.createDate(resultedStartDate, {
        path: 'fromGrid'
      });
    }
    const result = (0, _m_appointment_adapter.createAppointmentAdapter)({}, this._dataAccessors, this.timeZoneCalculator);
    if (targetCell.allDay !== undefined) {
      result.allDay = targetCell.allDay;
    }
    result.startDate = resultedStartDate;
    let resultedEndDate = new Date(resultedStartDate.getTime() + duration);
    if (this.appointmentTakesAllDay(rawAppointment) && !result.allDay && this._workSpace.supportAllDayRow()) {
      resultedEndDate = this._workSpace.calculateEndDate(resultedStartDate);
    }
    if (appointment.allDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
      const dateCopy = new Date(resultedStartDate);
      dateCopy.setHours(0);
      resultedEndDate = new Date(dateCopy.getTime() + duration);
      if (resultedEndDate.getHours() !== 0) {
        resultedEndDate.setHours(this._getCurrentViewOption('endDayHour'));
      }
    }
    result.startDate = _date3.dateUtilsTs.addOffsets(result.startDate, [viewOffset]);
    result.endDate = _date3.dateUtilsTs.addOffsets(resultedEndDate, [viewOffset]);
    const rawResult = result.source();
    (0, _m_utils2.setResourceToAppointment)(this.option('resources'), this.getResourceDataAccessors(), rawResult, targetCell.groups);
    return rawResult;
  };
  _proto.getTargetedAppointment = function getTargetedAppointment(appointment, element) {
    const settings = _m_utils.utils.dataAccessors.getAppointmentSettings(element);
    const info = _m_utils.utils.dataAccessors.getAppointmentInfo(element);
    const appointmentIndex = (0, _renderer.default)(element).data(this._appointments._itemIndexKey());
    const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(appointment, this._dataAccessors, this.timeZoneCalculator);
    const targetedAdapter = adapter.clone();
    if (this._isAgenda() && adapter.isRecurrent) {
      const {
        agendaSettings
      } = settings;
      targetedAdapter.startDate = _m_expression_utils.ExpressionUtils.getField(this._dataAccessors, 'startDate', agendaSettings);
      targetedAdapter.endDate = _m_expression_utils.ExpressionUtils.getField(this._dataAccessors, 'endDate', agendaSettings);
    } else if (settings) {
      targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we havn't info field
      targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
    }
    const rawTargetedAppointment = targetedAdapter.source();
    if (element) {
      this.setTargetedAppointmentResources(rawTargetedAppointment, element, appointmentIndex);
    }
    if (info) {
      rawTargetedAppointment.displayStartDate = new Date(info.appointment.startDate);
      rawTargetedAppointment.displayEndDate = new Date(info.appointment.endDate);
    }
    return rawTargetedAppointment;
  };
  _proto.subscribe = function subscribe(subject, action) {
    this._subscribes[subject] = _m_subscribes.default[subject] = action;
  };
  _proto.fire = function fire(subject) {
    const callback = this._subscribes[subject];
    const args = Array.prototype.slice.call(arguments);
    if (!(0, _type.isFunction)(callback)) {
      throw _ui.default.Error('E1031', subject);
    }
    return callback.apply(this, args.slice(1));
  };
  _proto.getTargetCellData = function getTargetCellData() {
    return this._workSpace.getDataByDroppableCell();
  };
  _proto._updateAppointment = function _updateAppointment(target, rawAppointment, onUpdatePrevented, dragEvent) {
    const updatingOptions = {
      newData: rawAppointment,
      oldData: (0, _extend.extend)({}, target),
      cancel: false
    };
    const performFailAction = function (err) {
      if (onUpdatePrevented) {
        onUpdatePrevented.call(this);
      }
      if (err && err.name === 'Error') {
        throw err;
      }
    }.bind(this);
    this._actions[StoreEventNames.UPDATING](updatingOptions);
    if (dragEvent && !(0, _type.isDeferred)(dragEvent.cancel)) {
      // @ts-expect-error
      dragEvent.cancel = new _deferred.Deferred();
    }
    return this._processActionResult(updatingOptions, function (canceled) {
      // @ts-expect-error
      let deferred = new _deferred.Deferred();
      if (!canceled) {
        this._expandAllDayPanel(rawAppointment);
        try {
          deferred = this.appointmentDataProvider.update(target, rawAppointment).done(() => {
            dragEvent && dragEvent.cancel.resolve(false);
          }).always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment)).fail(() => performFailAction());
        } catch (err) {
          performFailAction(err);
          deferred.resolve();
        }
      } else {
        performFailAction();
        deferred.resolve();
      }
      return deferred.promise();
    });
  };
  _proto._processActionResult = function _processActionResult(actionOptions, callback) {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const resolveCallback = callbackResult => {
      (0, _deferred.when)((0, _deferred.fromPromise)(callbackResult)).always(deferred.resolve);
    };
    if ((0, _type.isPromise)(actionOptions.cancel)) {
      (0, _deferred.when)((0, _deferred.fromPromise)(actionOptions.cancel)).always(cancel => {
        if (!(0, _type.isDefined)(cancel)) {
          cancel = actionOptions.cancel.state() === 'rejected';
        }
        resolveCallback(callback.call(this, cancel));
      });
    } else {
      resolveCallback(callback.call(this, actionOptions.cancel));
    }
    return deferred.promise();
  };
  _proto._expandAllDayPanel = function _expandAllDayPanel(appointment) {
    if (!this._isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
      this._workSpace.option('allDayExpanded', true);
    }
  };
  _proto._onDataPromiseCompleted = function _onDataPromiseCompleted(handlerName, storeAppointment, appointment) {
    const args = {
      appointmentData: appointment || storeAppointment
    };
    if (storeAppointment instanceof Error) {
      args.error = storeAppointment;
    } else {
      this._appointmentPopup.visible && this._appointmentPopup.hide();
    }
    this._actions[handlerName](args);
    this._fireContentReadyAction();
  };
  _proto.getAppointmentsInstance = function getAppointmentsInstance() {
    return this._appointments;
  };
  _proto.getLayoutManager = function getLayoutManager() {
    return this._layoutManager;
  };
  _proto.getRenderingStrategyInstance = function getRenderingStrategyInstance() {
    return this.getLayoutManager().getRenderingStrategyInstance();
  };
  _proto.getActions = function getActions() {
    return this._actions;
  };
  _proto.appointmentTakesAllDay = function appointmentTakesAllDay(rawAppointment) {
    const appointment = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    return (0, _index2.getAppointmentTakesAllDay)(appointment, this._getCurrentViewOption('allDayPanelMode'));
  };
  _proto.dayHasAppointment = function dayHasAppointment(day, rawAppointment, trimTime) {
    const getConvertedToTimeZone = date => this.timeZoneCalculator.createDate(date, {
      path: 'toGrid'
    });
    const appointment = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    let startDate = new Date(appointment.startDate);
    let endDate = new Date(appointment.endDate);
    startDate = getConvertedToTimeZone(startDate);
    endDate = getConvertedToTimeZone(endDate);
    if (day.getTime() === endDate.getTime()) {
      return startDate.getTime() === endDate.getTime();
    }
    if (trimTime) {
      day = _date.default.trimTime(day);
      startDate = _date.default.trimTime(startDate);
      endDate = _date.default.trimTime(endDate);
    }
    const dayTimeStamp = day.getTime();
    const startDateTimeStamp = startDate.getTime();
    const endDateTimeStamp = endDate.getTime();
    return startDateTimeStamp <= dayTimeStamp && dayTimeStamp <= endDateTimeStamp;
  };
  _proto.setTargetedAppointmentResources = function setTargetedAppointmentResources(rawAppointment, element, appointmentIndex) {
    const groups = this._getCurrentViewOption('groups');
    if (groups === null || groups === void 0 ? void 0 : groups.length) {
      const resourcesSetter = this.getResourceDataAccessors().setter;
      const workSpace = this._workSpace;
      let getGroups;
      let setResourceCallback;
      if (this._isAgenda()) {
        getGroups = function () {
          const apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];
          return (0, _m_utils2.getCellGroups)(apptSettings[0].groupIndex, this.getWorkSpace().option('groups'));
        };
        setResourceCallback = function (_, group) {
          resourcesSetter[group.name](rawAppointment, group.id);
        };
      } else {
        getGroups = function () {
          // TODO: in the future, necessary refactor the engine of determining groups
          const setting = _m_utils.utils.dataAccessors.getAppointmentSettings(element) || {};
          return workSpace.getCellDataByCoordinates({
            left: setting.left,
            top: setting.top
          }).groups;
        };
        setResourceCallback = function (field, value) {
          resourcesSetter[field](rawAppointment, value);
        };
      }
      (0, _iterator.each)(getGroups.call(this), setResourceCallback);
    }
  };
  _proto.getStartViewDate = function getStartViewDate() {
    var _a;
    return (_a = this._workSpace) === null || _a === void 0 ? void 0 : _a.getStartViewDate();
  };
  _proto.getEndViewDate = function getEndViewDate() {
    return this._workSpace.getEndViewDate();
  };
  _proto.showAddAppointmentPopup = function showAddAppointmentPopup(cellData, cellGroups) {
    const appointmentAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)({}, this._dataAccessors, this.timeZoneCalculator);
    appointmentAdapter.allDay = cellData.allDay;
    appointmentAdapter.startDate = this.timeZoneCalculator.createDate(cellData.startDate, {
      path: 'fromGrid'
    });
    appointmentAdapter.endDate = this.timeZoneCalculator.createDate(cellData.endDate, {
      path: 'fromGrid'
    });
    const resultAppointment = (0, _extend.extend)(appointmentAdapter.source(), cellGroups);
    this.showAppointmentPopup(resultAppointment, true);
  };
  _proto.showAppointmentPopup = function showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment) {
    const newRawTargetedAppointment = _extends({}, rawTargetedAppointment);
    if (newRawTargetedAppointment) {
      delete newRawTargetedAppointment.displayStartDate;
      delete newRawTargetedAppointment.displayEndDate;
    }
    const appointment = (0, _m_appointment_adapter.createAppointmentAdapter)(newRawTargetedAppointment || rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    const newTargetedAppointment = (0, _extend.extend)({}, rawAppointment, newRawTargetedAppointment);
    const isCreateAppointment = createNewAppointment !== null && createNewAppointment !== void 0 ? createNewAppointment : (0, _type.isEmptyObject)(rawAppointment);
    if ((0, _type.isEmptyObject)(rawAppointment)) {
      rawAppointment = this.createPopupAppointment();
    }
    if (isCreateAppointment) {
      delete this._editAppointmentData; // TODO
      this._editing.allowAdding && this._appointmentPopup.show(rawAppointment, {
        isToolbarVisible: true,
        action: _m_popup.ACTION_TO_APPOINTMENT.CREATE
      });
    } else {
      this._checkRecurringAppointment(rawAppointment, newTargetedAppointment, appointment.startDate, () => {
        this._editAppointmentData = rawAppointment; // TODO
        this._appointmentPopup.show(rawAppointment, {
          isToolbarVisible: this._editing.allowUpdating,
          action: _m_popup.ACTION_TO_APPOINTMENT.UPDATE
        });
      }, false, true);
    }
  };
  _proto.createPopupAppointment = function createPopupAppointment() {
    const result = {};
    const toMs = _date.default.dateToMilliseconds;
    const startDate = new Date(this.option('currentDate'));
    const endDate = new Date(startDate.getTime() + this.option('cellDuration') * toMs('minute'));
    _m_expression_utils.ExpressionUtils.setField(this._dataAccessors, 'startDate', result, startDate);
    _m_expression_utils.ExpressionUtils.setField(this._dataAccessors, 'endDate', result, endDate);
    return result;
  };
  _proto.hideAppointmentPopup = function hideAppointmentPopup(saveChanges) {
    var _a;
    if ((_a = this._appointmentPopup) === null || _a === void 0 ? void 0 : _a.visible) {
      saveChanges && this._appointmentPopup.saveChangesAsync();
      this._appointmentPopup.hide();
    }
  };
  _proto.showAppointmentTooltip = function showAppointmentTooltip(appointment, element, targetedAppointment) {
    if (appointment) {
      const settings = _m_utils.utils.dataAccessors.getAppointmentSettings(element);
      const appointmentConfig = {
        itemData: targetedAppointment || appointment,
        groupIndex: settings === null || settings === void 0 ? void 0 : settings.groupIndex,
        groups: this.option('groups')
      };
      const getAppointmentColor = this.createGetAppointmentColor();
      const deferredColor = getAppointmentColor(appointmentConfig);
      const info = new _m_data_structures.AppointmentTooltipInfo(appointment, targetedAppointment, deferredColor);
      this.showAppointmentTooltipCore(element, [info]);
    }
  };
  _proto.createGetAppointmentColor = function createGetAppointmentColor() {
    return appointmentConfig => {
      const resourceConfig = {
        resources: this.option('resources'),
        dataAccessors: this.getResourceDataAccessors(),
        loadedResources: this.option('loadedResources'),
        resourceLoaderMap: this.option('resourceLoaderMap')
      };
      return (0, _m_utils2.getAppointmentColor)(resourceConfig, appointmentConfig);
    };
  };
  _proto.showAppointmentTooltipCore = function showAppointmentTooltipCore(target, data, options) {
    const arg = {
      cancel: false,
      appointments: data.map(item => {
        const result = {
          appointmentData: item.appointment,
          currentAppointmentData: _extends({}, item.targetedAppointment),
          color: item.color
        };
        if (item.settings.info) {
          const {
            startDate,
            endDate
          } = item.settings.info.appointment;
          result.currentAppointmentData.displayStartDate = startDate;
          result.currentAppointmentData.displayEndDate = endDate;
        }
        return result;
      }),
      targetElement: target
    };
    this._createActionByOption('onAppointmentTooltipShowing')(arg);
    if (this._appointmentTooltip.isAlreadyShown(target)) {
      this.hideAppointmentTooltip();
    } else {
      this._processActionResult(arg, canceled => {
        !canceled && this._appointmentTooltip.show(target, data, _extends(_extends({}, this._getExtraAppointmentTooltipOptions()), options));
      });
    }
  };
  _proto.hideAppointmentTooltip = function hideAppointmentTooltip() {
    this._appointmentTooltip && this._appointmentTooltip.hide();
  };
  _proto.scrollToTime = function scrollToTime(hours, minutes, date) {
    _ui.default.log('W0002', 'dxScheduler', 'scrollToTime', '21.1', 'Use the "scrollTo" method instead');
    this._workSpace.scrollToTime(hours, minutes, date);
  };
  _proto.scrollTo = function scrollTo(date, groups, allDay) {
    this._workSpace.scrollTo(date, groups, allDay);
  };
  _proto._isHorizontalVirtualScrolling = function _isHorizontalVirtualScrolling() {
    const scrolling = this.option('scrolling');
    const {
      orientation,
      mode
    } = scrolling;
    const isVirtualScrolling = mode === 'virtual';
    return isVirtualScrolling && (orientation === 'horizontal' || orientation === 'both');
  };
  _proto.addAppointment = function addAppointment(rawAppointment) {
    const appointment = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    appointment.text = appointment.text || '';
    const serializedAppointment = appointment.source(true);
    const addingOptions = {
      appointmentData: serializedAppointment,
      cancel: false
    };
    this._actions[StoreEventNames.ADDING](addingOptions);
    return this._processActionResult(addingOptions, canceled => {
      if (canceled) {
        // @ts-expect-error
        return new _deferred.Deferred().resolve();
      }
      this._expandAllDayPanel(serializedAppointment);
      return this.appointmentDataProvider.add(serializedAppointment).always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment));
    });
  };
  _proto.updateAppointment = function updateAppointment(target, appointment) {
    return this._updateAppointment(target, appointment);
  };
  _proto.deleteAppointment = function deleteAppointment(rawAppointment) {
    const deletingOptions = this.fireOnAppointmentDeleting(rawAppointment);
    this.processDeleteAppointment(rawAppointment, deletingOptions);
  };
  _proto.fireOnAppointmentDeleting = function fireOnAppointmentDeleting(rawAppointment, targetedAppointmentData) {
    const deletingOptions = {
      appointmentData: rawAppointment,
      targetedAppointmentData,
      cancel: false
    };
    this._actions[StoreEventNames.DELETING](deletingOptions);
    return deletingOptions;
  };
  _proto.processDeleteAppointment = function processDeleteAppointment(rawAppointment, deletingOptions) {
    this._processActionResult(deletingOptions, function (canceled) {
      if (!canceled) {
        this.appointmentDataProvider.remove(rawAppointment).always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.DELETED, storeAppointment, rawAppointment));
      }
    });
  };
  _proto.deleteRecurrence = function deleteRecurrence(appointment, date, recurrenceEditMode) {
    this._checkRecurringAppointment(appointment, {}, date, () => {
      this.processDeleteAppointment(appointment, {
        cancel: false
      });
    }, true, false, null, recurrenceEditMode);
  };
  _proto.focus = function focus() {
    if (this._editAppointmentData) {
      this._appointments.focus();
    } else {
      this._workSpace.focus();
    }
  };
  _proto.getFirstDayOfWeek = function getFirstDayOfWeek() {
    return (0, _type.isDefined)(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : _date2.default.firstDayOfWeekIndex();
  };
  _proto._validateKeyFieldIfAgendaExist = function _validateKeyFieldIfAgendaExist() {
    if (!this.appointmentDataProvider.isDataSourceInit) {
      return;
    }
    const hasAgendaView = !!this._getViewByName('agenda');
    const isKeyExist = !!this.appointmentDataProvider.keyName;
    if (hasAgendaView && !isKeyExist) {
      _ui.default.log('W1023');
    }
  };
  _proto._getDragBehavior = function _getDragBehavior() {
    return this._workSpace.dragBehavior;
  };
  _proto.getViewOffsetMs = function getViewOffsetMs() {
    const offsetFromOptions = this._getCurrentViewOption('offset');
    return this.normalizeViewOffsetValue(offsetFromOptions);
  };
  _proto.normalizeViewOffsetValue = function normalizeViewOffsetValue(viewOffset) {
    if (!(0, _type.isDefined)(viewOffset) || this.currentViewType === _m_constants.VIEWS.AGENDA) {
      return 0;
    }
    return viewOffset * toMs('minute');
  };
  _proto.validateOptions = function validateOptions() {
    const currentViewOptions = _extends(_extends({}, this.option()), {
      // TODO: Check it before 24.1 release
      // NOTE: We override this.option values here
      // because the old validation logic checked only current view options.
      // Changing it and validate all views configuration will be a BC.
      startDayHour: this._getCurrentViewOption('startDayHour'),
      endDayHour: this._getCurrentViewOption('endDayHour'),
      offset: this._getCurrentViewOption('offset'),
      cellDuration: this._getCurrentViewOption('cellDuration')
    });
    const validationResult = this._optionsValidator.validate(currentViewOptions);
    this._optionsValidatorErrorHandler.handleValidationResult(validationResult);
  };
  _createClass(Scheduler, [{
    key: "filteredItems",
    get: function () {
      if (!this._filteredItems) {
        this._filteredItems = [];
      }
      return this._filteredItems;
    },
    set: function (value) {
      this._filteredItems = value;
    }
  }, {
    key: "preparedItems",
    get: function () {
      if (!this._preparedItems) {
        this._preparedItems = [];
      }
      return this._preparedItems;
    },
    set: function (value) {
      this._preparedItems = value;
    }
  }, {
    key: "currentView",
    get: function () {
      return _index2.viewsUtils.getCurrentView(this.option('currentView'), this.option('views'));
    }
  }, {
    key: "currentViewType",
    get: function () {
      return (0, _type.isObject)(this.currentView) ? this.currentView.type : this.currentView;
    }
  }, {
    key: "timeZoneCalculator",
    get: function () {
      if (!this._timeZoneCalculator) {
        this._timeZoneCalculator = (0, _index.createTimeZoneCalculator)(this.option('timeZone'));
      }
      return this._timeZoneCalculator;
    }
  }]);
  return Scheduler;
}(_ui2.default);
Scheduler.include(_data_helper.default);
(0, _component_registrator.default)('dxScheduler', Scheduler);
var _default = exports.default = Scheduler;