/**
* DevExtreme (esm/__internal/core/component_wrappers/template_wrapper.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable class-methods-use-this */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import $ from '../../../core/renderer';
import { replaceWith } from '../../../core/utils/dom';
import { isDefined } from '../../../core/utils/type';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { shallowEquals } from './utils/shallow_equals';
var isDxElementWrapper = element => !!element.toArray;
export var buildTemplateArgs = (model, template) => {
  var _a;
  var args = {
    template,
    model: _extends({}, model)
  };
  var _b = (_a = model.data) !== null && _a !== void 0 ? _a : {},
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
var renderTemplateContent = (props, container) => {
  var _a;
  var {
    data,
    index
  } = (_a = props.model) !== null && _a !== void 0 ? _a : {
    data: {}
  };
  if (data) {
    Object.keys(data).forEach(name => {
      if (data[name] && domAdapter.isNode(data[name])) {
        data[name] = getPublicElement($(data[name]));
      }
    });
  }
  var rendered = props.template.render(_extends(_extends(_extends({
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
  return isDxElementWrapper(rendered) ? rendered.toArray() : [$(rendered).get(0)];
};
var removeDifferentElements = (oldChildren, newChildren) => {
  newChildren.forEach(newElement => {
    var hasOldChild = !!oldChildren.find(oldElement => newElement === oldElement);
    if (!hasOldChild && newElement.parentNode) {
      // @ts-expect-error The renderer's remove() function requires an argument in .d.ts.
      // We currenlty suppress the error if we don't need the argument (see Grids).
      // We should change the .d.ts (maybe make the parameter optional).
      $(newElement).remove();
    }
  });
};
export class TemplateWrapper extends InfernoComponent {
  constructor(props) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }
  renderTemplate() {
    // eslint-disable-next-line spellcheck/spell-checker
    var node = findDOMfromVNode(this.$LI, true);
    /* istanbul ignore next */
    if (!(node === null || node === void 0 ? void 0 : node.parentNode)) {
      return () => {};
    }
    var container = node.parentNode;
    var $container = $(container);
    var $oldContainerContent = $container.contents().toArray();
    var content = renderTemplateContent(this.props, getPublicElement($container));
    // TODO Vinogradov: Fix the renderer function type.
    // @ts-expect-error The renderer function's argument hasn't the full range of possible types
    // (the Element[] type is missing).
    replaceWith($(node), $(content));
    // NOTE: This is a dispose method that called before renderTemplate.
    return () => {
      var $actualContainerContent = $(container).contents().toArray();
      removeDifferentElements($oldContainerContent, $actualContainerContent);
      container.appendChild(node);
    };
  }
  shouldComponentUpdate(nextProps) {
    var {
      template,
      model
    } = this.props;
    var {
      template: nextTemplate,
      model: nextModel,
      isEqual
    } = nextProps;
    var equalityComparer = isEqual !== null && isEqual !== void 0 ? isEqual : shallowEquals;
    if (template !== nextTemplate) {
      return true;
    }
    if (!isDefined(model) || !isDefined(nextModel)) {
      return model !== nextModel;
    }
    var {
      data,
      index
    } = model;
    var {
      data: nextData,
      index: nextIndex
    } = nextModel;
    if (index !== nextIndex) {
      return true;
    }
    return !equalityComparer(data, nextData);
  }
  createEffects() {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }
  updateEffects() {
    this._effects[0].update([this.props.template, this.props.model]);
  }
  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  componentWillUnmount() {}
  render() {
    return null;
  }
}
