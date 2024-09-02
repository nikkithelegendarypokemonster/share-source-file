import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["isEqual"];
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import { findDOMfromVNode } from 'inferno';
import { replaceWith } from '../../../core/utils/dom';
import { shallowEquals } from '../../utils/shallow_equals';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import { isDefined } from '../../../core/utils/type';
function isDxElementWrapper(element) {
  return !!element.toArray;
}
export function buildTemplateArgs(model, template) {
  const args = {
    template,
    model: _extends({}, model)
  };
  const _ref = model.data ?? {},
    {
      isEqual
    } = _ref,
    data = _objectWithoutPropertiesLoose(_ref, _excluded);
  if (isEqual) {
    args.model.data = data;
    args.isEqual = isEqual;
  }
  return args;
}
function renderTemplateContent(props, container) {
  const {
    data,
    index
  } = props.model ?? {
    data: {}
  };
  if (data) {
    Object.keys(data).forEach(name => {
      if (data[name] && domAdapter.isNode(data[name])) {
        data[name] = getPublicElement($(data[name]));
      }
    });
  }
  const rendered = props.template.render(_extends({
    container,
    transclude: props.transclude
  }, {
    renovated: props.renovated
  }, !props.transclude ? {
    model: data
  } : {}, !props.transclude && Number.isFinite(index) ? {
    index
  } : {}));
  if (rendered === undefined) {
    return [];
  }
  return isDxElementWrapper(rendered) ? rendered.toArray() : [$(rendered).get(0)];
}
function removeDifferentElements(oldChildren, newChildren) {
  newChildren.forEach(newElement => {
    const hasOldChild = !!oldChildren.find(oldElement => newElement === oldElement);
    if (!hasOldChild && newElement.parentNode) {
      $(newElement).remove();
    }
  });
}
export class TemplateWrapper extends InfernoComponent {
  constructor(props) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }
  renderTemplate() {
    const node = findDOMfromVNode(this.$LI, true);
    if (!(node !== null && node !== void 0 && node.parentNode)) {
      return () => {};
    }
    const container = node.parentNode;
    const $container = $(container);
    const $oldContainerContent = $container.contents().toArray();
    const content = renderTemplateContent(this.props, getPublicElement($container));
    replaceWith($(node), $(content));
    return () => {
      const $actualContainerContent = $(container).contents().toArray();
      removeDifferentElements($oldContainerContent, $actualContainerContent);
      container.appendChild(node);
    };
  }
  shouldComponentUpdate(nextProps) {
    const {
      model,
      template
    } = this.props;
    const {
      isEqual,
      model: nextModel,
      template: nextTemplate
    } = nextProps;
    const equalityComparer = isEqual ?? shallowEquals;
    if (template !== nextTemplate) {
      return true;
    }
    if (!isDefined(model) || !isDefined(nextModel)) {
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
  }
  createEffects() {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }
  updateEffects() {
    this._effects[0].update([this.props.template, this.props.model]);
  }
  componentWillUnmount() {}
  render() {
    return null;
  }
}