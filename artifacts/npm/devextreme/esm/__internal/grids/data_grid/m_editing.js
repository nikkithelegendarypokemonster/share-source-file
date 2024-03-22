/**
* DevExtreme (esm/__internal/grids/data_grid/m_editing.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import './module_not_extended/editor_factory';
import { dataControllerEditingExtenderMixin, editingModule } from '../../grids/grid_core/editing/m_editing';
import gridCore from './m_core';
var data = Base => class DataEditingDataGridExtender extends dataControllerEditingExtenderMixin(Base) {
  _changeRowExpandCore(key) {
    var editingController = this._editingController;
    if (Array.isArray(key)) {
      editingController && editingController.refresh();
    }
    // @ts-expect-error
    return super._changeRowExpandCore.apply(this, arguments);
  }
};
gridCore.registerModule('editing', _extends(_extends({}, editingModule), {
  extenders: _extends(_extends({}, editingModule.extenders), {
    controllers: _extends(_extends({}, editingModule.extenders.controllers), {
      data
    })
  })
}));
