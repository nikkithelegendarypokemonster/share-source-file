/**
* DevExtreme (esm/__internal/ui/html_editor/formats/m_mention.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../../core/renderer';
import Quill from 'devextreme-quill';
import TemplatesStorage from '../utils/m_templates_storage';
// eslint-disable-next-line import/no-mutable-exports
let Mention = {};
if (Quill) {
  const Embed = Quill.import('blots/embed');
  const MENTION_CLASS = 'dx-mention';
  Mention = class Mention extends Embed {
    constructor(scroll, node) {
      super(scroll, node);
      this.renderContent(this.contentNode, Mention.value(node));
    }
    static create(data) {
      const node = super.create();
      node.setAttribute('spellcheck', false);
      node.dataset.marker = data.marker;
      node.dataset.mentionValue = data.value;
      node.dataset.id = data.id;
      return node;
    }
    static value(node) {
      return {
        marker: node.dataset.marker,
        id: node.dataset.id,
        value: node.dataset.mentionValue
      };
    }
    renderContent(node, data) {
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
    }
    baseContentRender(node, data) {
      const $marker = $('<span>').text(data.marker);
      $(node).append($marker).append(data.value);
    }
    static addTemplate(data, template) {
      this._templatesStorage.set(data, template);
    }
    static removeTemplate(data) {
      this._templatesStorage.delete(data);
    }
  };
  // @ts-expect-error
  Mention.blotName = 'mention';
  // @ts-expect-error
  Mention.tagName = 'span';
  // @ts-expect-error
  Mention.className = MENTION_CLASS;
  // @ts-expect-error
  Mention._templatesStorage = new TemplatesStorage();
}
export default Mention;
