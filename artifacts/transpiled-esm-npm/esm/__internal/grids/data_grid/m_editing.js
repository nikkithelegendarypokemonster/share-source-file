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