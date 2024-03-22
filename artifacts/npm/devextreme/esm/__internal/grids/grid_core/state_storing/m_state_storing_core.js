/**
* DevExtreme (esm/__internal/grids/grid_core/state_storing/m_state_storing_core.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// @ts-expect-error
import { fromPromise } from '../../../../core/utils/deferred';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { sessionStorage } from '../../../../core/utils/storage';
import { isDefined, isEmptyObject, isPlainObject } from '../../../../core/utils/type';
import { getWindow } from '../../../../core/utils/window';
import eventsEngine from '../../../../events/core/events_engine';
import errors from '../../../../ui/widget/ui.errors';
import modules from '../m_modules';
var DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
var parseDates = function parseDates(state) {
  if (!state) return;
  each(state, (key, value) => {
    if (isPlainObject(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      var date = DATE_REGEX.exec(value);
      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};
var getStorage = function getStorage(options) {
  var storage = options.type === 'sessionStorage' ? sessionStorage() : getWindow().localStorage;
  if (!storage) {
    throw new Error('E1007');
  }
  return storage;
};
var getUniqueStorageKey = function getUniqueStorageKey(options) {
  return isDefined(options.storageKey) ? options.storageKey : 'storage';
};
export class StateStoringController extends modules.ViewController {
  // TODO getController
  // NOTE: sometimes fields empty in the runtime
  // getter here is a temporary solution
  get _dataController() {
    return this.getController('data');
  }
  get _exportController() {
    return this.getController('export');
  }
  get _columnsController() {
    return this.getController('columns');
  }
  init() {
    this._state = {};
    this._isLoaded = false;
    this._isLoading = false;
    this._windowUnloadHandler = () => {
      if (this._savingTimeoutID !== undefined) {
        this._saveState(this.state());
      }
    };
    eventsEngine.on(getWindow(), 'unload', this._windowUnloadHandler);
    return this; // needed by pivotGrid mocks
  }
  optionChanged(args) {
    var that = this;
    switch (args.name) {
      case 'stateStoring':
        if (that.isEnabled() && !that.isLoading()) {
          that.load();
        }
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  dispose() {
    clearTimeout(this._savingTimeoutID);
    eventsEngine.off(getWindow(), 'unload', this._windowUnloadHandler);
  }
  _loadState() {
    var options = this.option('stateStoring');
    if (options.type === 'custom') {
      return options.customLoad && options.customLoad();
    }
    try {
      // @ts-expect-error
      return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
    } catch (e) {
      errors.log('W1022', 'State storing', e.message);
    }
  }
  _saveState(state) {
    var options = this.option('stateStoring');
    if (options.type === 'custom') {
      options.customSave && options.customSave(state);
      return;
    }
    try {
      getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
    } catch (e) {
      errors.log(e.message);
    }
  }
  publicMethods() {
    return ['state'];
  }
  isEnabled() {
    return this.option('stateStoring.enabled');
  }
  isLoaded() {
    return this._isLoaded;
  }
  isLoading() {
    return this._isLoading;
  }
  load() {
    this._isLoading = true;
    var loadResult = fromPromise(this._loadState());
    loadResult.always(() => {
      this._isLoaded = true;
      this._isLoading = false;
    }).done(state => {
      if (state !== null && !isEmptyObject(state)) {
        this.state(state);
      }
    });
    return loadResult;
  }
  state(state) {
    var that = this;
    if (!arguments.length) {
      return extend(true, {}, that._state);
    }
    that._state = extend({}, state);
    parseDates(that._state);
  }
  save() {
    var that = this;
    clearTimeout(that._savingTimeoutID);
    that._savingTimeoutID = setTimeout(() => {
      that._saveState(that.state());
      that._savingTimeoutID = undefined;
    }, that.option('stateStoring.savingTimeout'));
  }
}
export default {
  StateStoringController
};
