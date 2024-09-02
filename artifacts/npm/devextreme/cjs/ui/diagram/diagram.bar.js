/**
* DevExtreme (cjs/ui/diagram/diagram.bar.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _diagram = require("./diagram.importer");
class DiagramBar {
  constructor(owner) {
    const {
      EventDispatcher
    } = (0, _diagram.getDiagram)();
    this.onChanged = new EventDispatcher(); // IBar.onChanged: EventDispatcher<IBarListener>
    this._owner = owner;
  }
  raiseBarCommandExecuted(key, parameter) {
    this.onChanged.raise('notifyBarCommandExecuted', parseInt(key), parameter);
  }
  getCommandKeys() {
    // IBar.getCommandKeys(): DiagramCommand[]
    throw 'Not Implemented';
  }
  setItemValue(key, value) {// IBar.setItemValue(key: DiagramCommand, value: any)
  }
  setItemEnabled(key, enabled) {// IBar.setItemEnabled(key: DiagramCommand, enabled: boolean)
  }
  setItemVisible(key, enabled) {// IBar.setItemVisible(key: DiagramCommand, visible: boolean)
  }
  setEnabled(enabled) {// IBar.setEnabled(enabled: boolean)
  }
  setItemSubItems(key, items) {// IBar.setItemSubItems(key: DiagramCommand, items: any[])
  }
  isVisible() {
    // IBar.isVisible(): boolean
    return true;
  }
  _getKeys(items) {
    const keys = items.reduce((commands, item) => {
      if (item.command !== undefined) {
        commands.push(item.command);
      }
      if (item.items) {
        commands = commands.concat(this._getKeys(item.items));
      }
      return commands;
    }, []);
    return keys;
  }
}
var _default = exports.default = DiagramBar;
module.exports = exports.default;
module.exports.default = exports.default;
