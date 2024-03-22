/**
* DevExtreme (esm/renovation/ui/editors/common/editor_state_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import devices from '../../../../core/devices';
export var EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  get focusStateEnabled() {
    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
  }
};
