/**
* DevExtreme (esm/ui/diagram/ui.diagram.main_toolbar.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';
class DiagramMainToolbar extends DiagramToolbar {
  _getCommands() {
    return DiagramCommandsManager.getMainToolbarCommands(this.option('commands'), this.option('excludeCommands'));
  }
}
export default DiagramMainToolbar;
