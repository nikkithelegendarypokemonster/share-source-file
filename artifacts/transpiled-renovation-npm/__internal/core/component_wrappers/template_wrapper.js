"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTemplateArgs = exports.TemplateWrapper = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _dom = require("../../../core/utils/dom");
var _type = require("../../../core/utils/type");
var _inferno2 = require("inferno");
var _shallow_equals = require("./utils/shallow_equals");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable class-methods-use-this */

// eslint-disable-next-line spellcheck/spell-checker

const isDxElementWrapper = element => !!element.toArray;
const buildTemplateArgs = (model, template) => {
  var _a;
  const args = {
    template,
    model: _extends({}, model)
  };
  const _b = (_a = model.data) !== null && _a !== void 0 ? _a : {},
    {
      isEqual
    } = _b,
    data = __rest(_b, ["isEqual"]);
  if (isEqual) {
    args.model.data = data;
    args.isEqual = isEqual;
  }
  return args;
};
exports.buildTemplateArgs = buildTemplateArgs;
const renderTemplateContent = (props, container) => {
  var _a;
  const {
    data,
    index
  } = (_a = props.model) !== null && _a !== void 0 ? _a : {
    data: {}
  };
  if (data) {
    Object.keys(data).forEach(name => {
      if (data[name] && _dom_adapter.default.isNode(data[name])) {
        data[name] = (0, _element.getPublicElement)((0, _renderer.default)(data[name]));
      }
    });
  }
  const rendered = props.template.render(_extends(_extends(_extends({
    container,
    transclude: props.transclude
  }, {
    renovated: props.renovated
  }), !props.transclude ? {
    model: data
  } : {}), !props.transclude && Number.isFinite(index) ? {
    index
  } : {}));
  if (rendered === undefined) {
    return [];
  }
  return isDxElementWrapper(rendered) ? rendered.toArray() : [(0, _renderer.default)(rendered).get(0)];
};
const removeDifferentElements = (oldChildren, newChildren) => {
  newChildren.forEach(newElement => {
    const hasOldChild = !!oldChildren.find(oldElement => newElement === oldElement);
    if (!hasOldChild && newElement.parentNode) {
      // @ts-expect-error The renderer's remove() function requires an argument in .d.ts.
      // We currenlty suppress the error if we don't need the argument (see Grids).
      // We should change the .d.ts (maybe make the parameter optional).
      (0, _renderer.default)(newElement).remove();
    }
  });
};
let TemplateWrapper = exports.TemplateWrapper = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(TemplateWrapper, _InfernoComponent);
  function TemplateWrapper(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.renderTemplate = _this.renderTemplate.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = TemplateWrapper.prototype;
  _proto.renderTemplate = function renderTemplate() {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = (0, _inferno2.findDOMfromVNode)(this.$LI, true);
    /* istanbul ignore next */
    if (!(node === null || node === void 0 ? void 0 : node.parentNode)) {
      return () => {};
    }
    const container = node.parentNode;
    const $container = (0, _renderer.default)(container);
    const $oldContainerContent = $container.contents().toArray();
    const content = renderTemplateContent(this.props, (0, _element.getPublicElement)($container));
    // TODO Vinogradov: Fix the renderer function type.
    // @ts-expect-error The renderer function's argument hasn't the full range of possible types
    // (the Element[] type is missing).
    (0, _dom.replaceWith)((0, _renderer.default)(node), (0, _renderer.default)(content));
    // NOTE: This is a dispose method that called before renderTemplate.
    return () => {
      const $actualContainerContent = (0, _renderer.default)(container).contents().toArray();
      removeDifferentElements($oldContainerContent, $actualContainerContent);
      container.appendChild(node);
    };
  };
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    const {
      template,
      model
    } = this.props;
    const {
      template: nextTemplate,
      model: nextModel,
      isEqual
    } = nextProps;
    const equalityComparer = isEqual !== null && isEqual !== void 0 ? isEqual : _shallow_equals.shallowEquals;
    if (template !== nextTemplate) {
      return true;
    }
    if (!(0, _type.isDefined)(model) || !(0, _type.isDefined)(nextModel)) {
      return model !== nextModel;
    }
    const {
      data,
      index
    } = model;
    const {
      data: nextData,
      index: nextIndex
    } = nextModel;
    if (index !== nextIndex) {
      return true;
    }
    return !equalityComparer(data, nextData);
  };
  _proto.createEffects = function createEffects() {
    return [new _inferno.InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  };
  _proto.updateEffects = function updateEffects() {
    this._effects[0].update([this.props.template, this.props.model]);
  }
  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  ;
  _proto.componentWillUnmount = function componentWillUnmount() {};
  _proto.render = function render() {
    return null;
  };
  return TemplateWrapper;
}(_inferno.InfernoComponent);