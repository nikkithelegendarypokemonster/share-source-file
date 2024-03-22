/**
* DevExtreme (esm/renovation/ui/editors/common/editor_label_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { isMaterial, current } from '../../../../ui/themes';
export var EditorLabelProps = {
  label: '',
  get labelMode() {
    return isMaterial(current()) ? 'floating' : 'static';
  }
};
