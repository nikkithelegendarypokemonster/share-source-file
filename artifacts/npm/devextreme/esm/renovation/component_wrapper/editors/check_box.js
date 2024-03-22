/**
* DevExtreme (esm/renovation/component_wrapper/editors/check_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Editor from './editor';
export default class CheckBox extends Editor {
  _useTemplates() {
    return false;
  }
  _isFocused() {
    var focusTarget = this.$element()[0];
    return focusTarget.classList.contains('dx-state-focused');
  }
  getSupportedKeyNames() {
    return ['space'];
  }
  getProps() {
    var props = super.getProps();
    if (props.value !== null) {
      props.value = Boolean(props.value);
    }
    return props;
  }
}
