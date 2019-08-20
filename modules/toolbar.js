import Delta from 'quill-delta';
import { EmbedBlot, Scope } from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';
import buildPinyin from '../ui/build-pinyin';

const debug = logger('quill:toolbar');

class Toolbar extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.container = this.options.container;
    // eslint-disable-next-line no-constant-condition
    if (this.options.container == null || 'default') {
      if (Array.isArray(this.options.options)) {
        const container = document.createElement('div');
        this.container = container;
      }
    } else if (typeof this.options.container === 'string') {
      this.container = document.querySelector(this.options.container);
    }
    this.iconConfig = Object.entries(options.config).reduce(
      (memo, [key, value]) => {
        if (typeof value === 'object' && value.icon) {
          memo[key] = value.icon;
        }
        return memo;
      },
      {},
    );
    this.addControls(this.container, this.options.options);
    // eslint-disable-next-line no-constant-condition
    if (this.options.container == null || 'default') {
      quill.container.parentNode.insertBefore(this.container, quill.container);
    }
    if (!(this.container instanceof HTMLElement)) {
      return debug.error('Container required for toolbar', this.options);
    }
    this.container.classList.add('ql-toolbar');
    this.controls = [];
    this.handlers = {};
    Object.keys(this.options.handlers).forEach(format => {
      this.addHandler(format, this.options.handlers[format]);
    });
    Array.from(this.container.querySelectorAll('button, select')).forEach(
      input => {
        this.attach(input);
      },
    );
    this.quill.on(Quill.events.EDITOR_CHANGE, (type, range) => {
      if (type === Quill.events.SELECTION_CHANGE) {
        this.update(range);
      }
    });
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      const [range] = this.quill.selection.getRange(); // quill.getSelection triggers update
      this.update(range);
    });
    this.quill.toolbarContainer = this.container;
  }

  addHandler(format, handler) {
    this.handlers[format] = handler;
  }

  attach(input) {
    let format = Array.from(input.classList).find(className => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    if (input.tagName === 'BUTTON') {
      input.setAttribute('type', 'button');
    }
    if (
      this.handlers[format] == null &&
      this.quill.scroll.query(format) == null
    ) {
      debug.warn('ignoring attaching to nonexistent format', format, input);
      return;
    }
    const eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, e => {
      let value;
      if (input.tagName === 'SELECT') {
        if (input.selectedIndex < 0) return;
        const selected = input.options[input.selectedIndex];
        if (selected.hasAttribute('selected')) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains('ql-active')) {
          value = false;
        } else {
          value = input.value || !input.hasAttribute('value');
        }
        e.preventDefault();
      }
      this.quill.focus();
      const [range] = this.quill.selection.getRange();
      if (this.handlers[format] != null) {
        this.handlers[format].call(this, value);
      } else if (
        this.quill.scroll.query(format).prototype instanceof EmbedBlot
      ) {
        value = prompt(`Enter ${format}`); // eslint-disable-line no-alert
        if (!value) return;
        this.quill.updateContents(
          new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ [format]: value }),
          Quill.sources.USER,
        );
      } else {
        this.quill.format(format, value, Quill.sources.USER);
      }
      this.update(range);
    });
    this.controls.push([format, input]);
  }

  addControls(container, groups) {
    if (!Array.isArray(groups[0])) {
      groups = [groups];
    }
    groups.forEach((controls, index) => {
      const group = container;
      // const group = document.createElement('span');
      // group.classList.add('ql-formats');
      controls.forEach(control => {
        if (control === 'pinyin') {
          group.appendChild(buildPinyin(this.quill));
        } else if (typeof control === 'string') {
          this.addButton(group, control);
        } else {
          const format = Object.keys(control)[0];
          const value = control[format];
          if (Array.isArray(value)) {
            this.addSelect(group, format, value);
          } else {
            this.addButton(group, format, value);
          }
        }
      });
      // container.appendChild(group);
      const line = document.createElement('i');
      line.classList.add('seperate-line');
      if (index !== groups.length - 1) {
        container.appendChild(line);
      }
    });
  }

  addButton(container, format, value) {
    const input = document.createElement('button');
    input.setAttribute('type', 'button');
    input.classList.add(`ql-${format}`);
    if (value != null) {
      input.value = value;
    }
    const i = document.createElement('i');
    i.classList.add('button-icon');
    if (this.iconConfig[format]) {
      i.style.setProperty(
        'background-image',
        `url(${this.iconConfig[format]})`,
        'important',
      );
      i.style.setProperty('background-size', '20px');
    }
    input.appendChild(i);
    container.appendChild(input);
  }

  addSelect(container, format, values) {
    const input = document.createElement('select');
    input.classList.add(`ql-${format}`);
    values.forEach(value => {
      const option = document.createElement('option');
      if (value !== false) {
        option.setAttribute('value', value);
      } else {
        option.setAttribute('selected', 'selected');
      }
      input.appendChild(option);
    });
    container.appendChild(input);
  }

  update(range) {
    const formats = range == null ? {} : this.quill.getFormat(range);
    // if (this.quill.tkEvents) {
    //   this.quill.tkEvents.getFormat(formats);
    // }
    this.controls.forEach(pair => {
      const [format, input] = pair;
      if (input.tagName === 'SELECT') {
        let option;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector('option[selected]');
        } else if (!Array.isArray(formats[format])) {
          let value = formats[format];
          if (typeof value === 'string') {
            value = value.replace(/"/g, '\\"');
          }
          option = input.querySelector(`option[value="${value}"]`);
        }
        if (option == null) {
          input.value = ''; // TODO make configurable?
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else if (range == null) {
        input.classList.remove('ql-active');
      } else if (input.hasAttribute('value')) {
        // both being null should match (default values)
        // '1' should match with 1 (headers)
        const isActive =
          formats[format] === input.getAttribute('value') ||
          (formats[format] != null &&
            formats[format].toString() === input.getAttribute('value')) ||
          (formats[format] == null && !input.getAttribute('value'));
        input.classList.toggle('ql-active', isActive);
      } else {
        input.classList.toggle('ql-active', formats[format] != null);
      }
    });
  }
}
Toolbar.DEFAULTS = {};

Toolbar.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const range = this.quill.getSelection();
      if (range == null) return;
      if (range.length === 0) {
        const formats = this.quill.getFormat();
        Object.keys(formats).forEach(name => {
          // Clean functionality in existing apps only clean inline formats
          if (this.quill.scroll.query(name, Scope.INLINE) != null) {
            this.quill.format(name, false, Quill.sources.USER);
          }
        });
      } else {
        this.quill.removeFormat(range, Quill.sources.USER);
      }
    },
    direction(value) {
      const { align } = this.quill.getFormat();
      if (value === 'rtl' && align == null) {
        this.quill.format('align', 'right', Quill.sources.USER);
      } else if (!value && align === 'right') {
        this.quill.format('align', false, Quill.sources.USER);
      }
      this.quill.format('direction', value, Quill.sources.USER);
    },
    indent(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      const indent = parseInt(formats.indent || 0, 10);
      if (value === '+1' || value === '-1') {
        let modifier = value === '+1' ? 1 : -1;
        if (formats.direction === 'rtl') modifier *= -1;
        this.quill.format('indent', indent + modifier, Quill.sources.USER);
      }
    },
    link(value) {
      if (value === true) {
        value = prompt('Enter link URL:'); // eslint-disable-line no-alert
      }
      this.quill.format('link', value, Quill.sources.USER);
    },
    list(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      if (value === 'check') {
        if (formats.list === 'checked' || formats.list === 'unchecked') {
          this.quill.format('list', false, Quill.sources.USER);
        } else {
          this.quill.format('list', 'unchecked', Quill.sources.USER);
        }
      } else {
        this.quill.format('list', value, Quill.sources.USER);
      }
    },
  },
};

export { Toolbar as default };
