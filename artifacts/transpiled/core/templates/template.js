"use strict";

exports.Template = void 0;
var _renderer = _interopRequireDefault(require("../renderer"));
var _template_base = require("./template_base");
var _dom = require("../utils/dom");
var _template_engine_registry = require("./template_engine_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
(0, _template_engine_registry.registerTemplateEngine)('default', {
  compile: element => (0, _dom.normalizeTemplateElement)(element),
  render: (template, model, index) => template.clone()
});
(0, _template_engine_registry.setTemplateEngine)('default');
let Template = exports.Template = /*#__PURE__*/function (_TemplateBase) {
  _inheritsLoose(Template, _TemplateBase);
  function Template(element) {
    var _this;
    _this = _TemplateBase.call(this) || this;
    _this._element = element;
    return _this;
  }
  var _proto = Template.prototype;
  _proto._renderCore = function _renderCore(options) {
    const transclude = options.transclude;
    if (!transclude && !this._compiledTemplate) {
      this._compiledTemplate = (0, _template_engine_registry.getCurrentTemplateEngine)().compile(this._element);
    }
    return (0, _renderer.default)('<div>').append(transclude ? this._element : (0, _template_engine_registry.getCurrentTemplateEngine)().render(this._compiledTemplate, options.model, options.index)).contents();
  };
  _proto.source = function source() {
    return (0, _renderer.default)(this._element).clone();
  };
  return Template;
}(_template_base.TemplateBase);