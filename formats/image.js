import { EmbedBlot } from 'parchment';
import { sanitize } from './link';

const ATTRIBUTES = {
  alt: undefined,
  height: undefined,
  width: undefined,
  'data-latex': undefined,
  class: ['yk-math-img'],
};

class Image extends EmbedBlot {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(key => {
        const val = key === 'src' ? this.sanitize(value[key]) : value[key];
        node.setAttribute(key, val);
      });
    }
    return node;
  }

  static formats() {
    return {};
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, false);
      }, 1);
    }
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return {
      src: domNode.getAttribute('src'),
      width: domNode.getAttribute('width'),
      height: domNode.getAttribute('height'),
    };
  }

  format(name, value) {
    if (Object.prototype.hasOwnProperty.call(ATTRIBUTES, name)) {
      if (value) {
        if (!ATTRIBUTES[name]) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.classList.add(value);
        }
      } else if (!ATTRIBUTES[name]) {
        this.domNode.removeAttribute(name, value);
      } else {
        this.domNode.classList.remove(value);
      }
    } else {
      super.format(name, value);
    }
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';

export default Image;
