"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _templates_storage = _interopRequireDefault(require("../utils/templates_storage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let Mention = {};
if (_devextremeQuill.default) {
  const Embed = _devextremeQuill.default.import('blots/embed');
  const MENTION_CLASS = 'dx-mention';
  Mention = /*#__PURE__*/function (_Embed) {
    _inheritsLoose(Mention, _Embed);
    function Mention(scroll, node) {
      var _this;
      _this = _Embed.call(this, scroll, node) || this;
      _this.renderContent(_this.contentNode, Mention.value(node));
      return _this;
    }
    Mention.create = function create(data) {
      const node = _Embed.create.call(this);
      node.setAttribute('spellcheck', false);
      node.dataset.marker = data.marker;
      node.dataset.mentionValue = data.value;
      node.dataset.id = data.id;
      return node;
    };
    Mention.value = function value(node) {
      return {
        marker: node.dataset.marker,
        id: node.dataset.id,
        value: node.dataset.mentionValue
      };
    };
    var _proto = Mention.prototype;
    _proto.renderContent = function renderContent(node, data) {
      const template = Mention._templatesStorage.get({
        editorKey: data.keyInTemplateStorage,
        marker: data.marker
      });
      if (template) {
        template.render({
          model: data,
          container: node
        });
      } else {
        this.baseContentRender(node, data);
      }
    };
    _proto.baseContentRender = function baseContentRender(node, data) {
      const $marker = (0, _renderer.default)('<span>').text(data.marker);
      (0, _renderer.default)(node).append($marker).append(data.value);
    };
    Mention.addTemplate = function addTemplate(data, template) {
      this._templatesStorage.set(data, template);
    };
    Mention.removeTemplate = function removeTemplate(data) {
      this._templatesStorage.delete(data);
    };
    return Mention;
  }(Embed);
  Mention.blotName = 'mention';
  Mention.tagName = 'span';
  Mention.className = MENTION_CLASS;
  Mention._templatesStorage = new _templates_storage.default();
}
var _default = exports.default = Mention;
module.exports = exports.default;
module.exports.default = exports.default;