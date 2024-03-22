/**
* DevExtreme (cjs/ui/text_box/texteditor_button_collection/index.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _custom = _interopRequireDefault(require("./custom"));
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../widget/ui.errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
function checkButtonInfo(buttonInfo) {
  const checkButtonType = () => {
    if (!buttonInfo || typeof buttonInfo !== 'object' || Array.isArray(buttonInfo)) {
      throw _ui.default.Error('E1053');
    }
  };
  const checkLocation = () => {
    const {
      location
    } = buttonInfo;
    if ('location' in buttonInfo && location !== 'after' && location !== 'before') {
      buttonInfo.location = 'after';
    }
  };
  const checkNameIsDefined = () => {
    if (!('name' in buttonInfo)) {
      throw _ui.default.Error('E1054');
    }
  };
  const checkNameIsString = () => {
    const {
      name
    } = buttonInfo;
    if (typeof name !== 'string') {
      throw _ui.default.Error('E1055');
    }
  };
  checkButtonType();
  checkNameIsDefined();
  checkNameIsString();
  checkLocation();
}
function checkNamesUniqueness(existingNames, newName) {
  if (existingNames.indexOf(newName) !== -1) {
    throw _ui.default.Error('E1055', newName);
  }
  existingNames.push(newName);
}
function isPredefinedButtonName(name, predefinedButtonsInfo) {
  return !!predefinedButtonsInfo.find(info => info.name === name);
}
let TextEditorButtonCollection = exports.default = /*#__PURE__*/function () {
  function TextEditorButtonCollection(editor, defaultButtonsInfo) {
    this.buttons = [];
    this.defaultButtonsInfo = defaultButtonsInfo;
    this.editor = editor;
  }
  var _proto = TextEditorButtonCollection.prototype;
  _proto._compileButtonInfo = function _compileButtonInfo(buttons) {
    const names = [];
    return buttons.map(button => {
      const isStringButton = typeof button === 'string';
      if (!isStringButton) {
        checkButtonInfo(button);
      }
      const isDefaultButton = isStringButton || isPredefinedButtonName(button.name, this.defaultButtonsInfo);
      if (isDefaultButton) {
        const defaultButtonInfo = this.defaultButtonsInfo.find(_ref => {
          let {
            name
          } = _ref;
          return name === button || name === button.name;
        });
        if (!defaultButtonInfo) {
          throw _ui.default.Error('E1056', this.editor.NAME, button);
        }
        checkNamesUniqueness(names, button);
        return defaultButtonInfo;
      } else {
        const {
          name
        } = button;
        checkNamesUniqueness(names, name);
        return (0, _extend.extend)(button, {
          Ctor: _custom.default
        });
      }
    });
  };
  _proto._createButton = function _createButton(buttonsInfo) {
    const {
      Ctor,
      options,
      name
    } = buttonsInfo;
    const button = new Ctor(name, this.editor, options);
    this.buttons.push(button);
    return button;
  };
  _proto._renderButtons = function _renderButtons(buttons, $container, targetLocation) {
    let $buttonsContainer = null;
    const buttonsInfo = buttons ? this._compileButtonInfo(buttons) : this.defaultButtonsInfo;
    const getButtonsContainer = () => {
      $buttonsContainer = $buttonsContainer || (0, _renderer.default)('<div>').addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS);
      targetLocation === 'before' ? $container.prepend($buttonsContainer) : $container.append($buttonsContainer);
      return $buttonsContainer;
    };
    buttonsInfo.forEach(buttonsInfo => {
      const {
        location = 'after'
      } = buttonsInfo;
      if (location === targetLocation) {
        this._createButton(buttonsInfo).render(getButtonsContainer());
      }
    });
    return $buttonsContainer;
  };
  _proto.clean = function clean() {
    this.buttons.forEach(button => button.dispose());
    this.buttons = [];
  };
  _proto.getButton = function getButton(buttonName) {
    const button = this.buttons.find(_ref2 => {
      let {
        name
      } = _ref2;
      return name === buttonName;
    });
    return button && button.instance;
  };
  _proto.renderAfterButtons = function renderAfterButtons(buttons, $container) {
    return this._renderButtons(buttons, $container, 'after');
  };
  _proto.renderBeforeButtons = function renderBeforeButtons(buttons, $container) {
    return this._renderButtons(buttons, $container, 'before');
  };
  _proto.updateButtons = function updateButtons(names) {
    this.buttons.forEach(button => {
      if (!names || names.indexOf(button.name) !== -1) {
        button.update();
      }
    });
  };
  return TextEditorButtonCollection;
}();
module.exports = exports.default;
module.exports.default = exports.default;
