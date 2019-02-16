import Inline from './inline';
import logger from '../core/logger';

const debug = logger('quill:format');

class TkInline extends Inline {
  static create(value) {
    if (typeof value === 'string') {
      if (this.whiteList.indexOf(value) < 0) {
        debug.warn(`invalid value: ${value} for ${this.blotName}`);
      }
      const node = document.createElement(this.tagName);
      node.classList.add(`${this.className}-${value}`);
      return node;
    }
    return super.create(value);
  }

  static formats(domNode) {
    const className = domNode.getAttribute('class') || '';
    return className
      .split(/\s+/)
      .find(name => name.indexOf(`${this.className}-`) === 0)
      .split(`${this.className}-`)[1];
  }
}

TkInline.tagName = 'span';
TkInline.whiteList = ['normal'];

export default TkInline;
