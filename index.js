import extend from 'extend';
import Quill, { register } from './quill';
import Keyboard from './modules/keyboard';
import Emitter from './core/emitter';

class TkEditor {
  constructor(options) {
    this.config = extend(
      true,
      {
        container: document.body,
        options: [],
        toolbar: {
          container: null,
        },
        initContent: '',
        events: {
          // openFormula: () => {},
          // insertBlankOption: () => {},
          getFormat: () => {},
        },
        keyboard: {},
      },
      options,
    );
    const formats = [];
    this.config.options.forEach(item => {
      if (typeof item === 'object') {
        formats.push([...Object.keys(item)]);
      } else {
        formats.push(item);
      }
    });
    register(formats);
    let { container } = this.config;
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    this.quill = new Quill(container, {
      theme: this.config.theme,
      modules: {
        toolbar: {
          container: this.config.toolbar.container,
          options: this.config.options,
        },
        keyboard: this.config.keyboard,
      },
      events: this.config.events,
    });
    this.quill.on(Quill.events.EDITOR_CHANGE, (type, range) => {
      if (type === Quill.events.SELECTION_CHANGE) {
        this.config.events.getFormat(
          range == null ? {} : this.quill.getFormat(range),
        );
      }
    });
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      const [range] = this.quill.selection.getRange();
      this.config.events.getFormat(
        range == null ? {} : this.quill.getFormat(range),
      );
    });
    if (this.config.initContent) {
      this.setContent(this.config.initContent);
    }
    this.savedRange = this.quill.selection.savedRange;
    this.wrapperClass = 'text-editor-wrapper';
  }

  setContent(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    this.quill.root.innerHTML =
      (div.firstElementChild && div.firstElementChild.innerHTML) || '';
  }

  getContent() {
    const copy = this.quill.root.cloneNode(true);
    copy.querySelectorAll('.ql-cursor').forEach(el => {
      el.parentNode.removeChild(el);
    });
    return `<div class="${this.wrapperClass}">${copy.innerHTML}</div>`;
  }

  getData() {
    return this.quill.getContents();
  }

  setData(delta) {
    this.quill.setContents(delta);
  }

  getSelection(focus = false) {
    return this.quill.getSelection(focus);
  }

  setSelection(index, length) {
    this.quill.setSelection(index, length);
  }

  insertEmbed(index, embed, value) {
    this.quill.insertEmbed(index, embed, value);
    if (embed === 'ql-mathjax') {
      this.quill.setSelection(index + 1);
    }
  }

  getModule(name) {
    return this.quill.getModule(name);
  }

  format(format, value) {
    this.quill.format(format, value);
    this.config.events.getFormat(this.quill.getFormat());
  }

  undo() {
    this.quill.history.undo();
  }

  redo() {
    this.quill.history.redo();
  }

  // 以焦点为分界，分割富文本内容
  splitContent() {
    const range = this.quill.getSelection();
    if (range == null) {
      return null;
    }

    const { index } = range;
    if (index === 0) {
      return ['', this.quill.getSemanticHTML()];
    }
    if (index === this.quill.getLength() - 1) {
      return [this.quill.getSemanticHTML(), ''];
    }
    const prev = this.quill.getSemanticHTML(0, index);
    const next = this.quill.getSemanticHTML(index, this.quill.getLength());
    return [prev, next];
  }

  isBlank() {
    return this.quill.editor.isBlank();
  }

  // 重设键盘绑定事件
  setKeyboardBindings(options) {
    const range = this.getSelection(true);
    const { keyboard } = this.quill;
    keyboard.bindings = Object.assign({}, Keyboard.DEFAULTS.bindings, options);
    Object.keys(keyboard.bindings).forEach(name => {
      if (keyboard.bindings[name]) {
        keyboard.addBinding(keyboard.bindings[name]);
      }
    });
    this.setSelection(range, Emitter.sources.SILENT);
  }
}

export default TkEditor;
