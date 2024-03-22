/**
* DevExtreme (esm/__internal/grids/tree_list/m_state_storing.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
// eslint-disable-next-line max-classes-per-file
import { stateStoringModule } from '../../grids/grid_core/state_storing/m_state_storing';
import treeListCore from './m_core';
var stateStoring = Base => class TreeListStateStoringExtender extends stateStoringModule.extenders.controllers.stateStoring(Base) {
  applyState(state) {
    super.applyState(state);
    this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
  }
};
var data = Base => class TreeListStateStoringDataExtender extends stateStoringModule.extenders.controllers.data(Base) {
  getUserState() {
    var state = super.getUserState();
    if (!this.option('autoExpandAll')) {
      state.expandedRowKeys = this.option('expandedRowKeys');
    }
    return state;
  }
};
treeListCore.registerModule('stateStoring', _extends(_extends({}, stateStoringModule), {
  extenders: _extends(_extends({}, stateStoringModule.extenders), {
    controllers: _extends(_extends({}, stateStoringModule.extenders.controllers), {
      stateStoring,
      data
    })
  })
}));
