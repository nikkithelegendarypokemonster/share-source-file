"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let Variable = {};
if (_devextremeQuill.default) {
  const Embed = _devextremeQuill.default.import('blots/embed');
  const VARIABLE_CLASS = 'dx-variable';
  Variable = /*#__PURE__*/function (_Embed) {
    _inheritsLoose(Variable, _Embed);
    function Variable() {
      return _Embed.apply(this, arguments) || this;
    }
    Variable.create = function create(data) {
      const node = _Embed.create.call(this);
      let startEscapeChar;
      let endEscapeChar;
      const text = data.value;
      if (Array.isArray(data.escapeChar)) {
        startEscapeChar = (0, _common.ensureDefined)(data.escapeChar[0], '');
        endEscapeChar = (0, _common.ensureDefined)(data.escapeChar[1], '');
      } else {
        startEscapeChar = endEscapeChar = data.escapeChar;
      }
      node.innerText = startEscapeChar + text + endEscapeChar;
      node.dataset.varStartEscChar = startEscapeChar;
      node.dataset.varEndEscChar = endEscapeChar;
      node.dataset.varValue = data.value;
      return node;
    };
    Variable.value = function value(node) {
      return (0, _extend.extend)({}, {
        value: node.dataset.varValue,
        escapeChar: [node.dataset.varStartEscChar || '', node.dataset.varEndEscChar || '']
      });
    };
    return Variable;
  }(Embed);
  Variable.blotName = 'variable';
  Variable.tagName = 'span';
  Variable.className = VARIABLE_CLASS;
}
var _default = exports.default = Variable;
module.exports = exports.default;
module.exports.default = exports.default;