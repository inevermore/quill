import extend from 'extend';
import Quill, { register } from './quill';
import getImgList from './utils/get-img-list';

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
          openFormula: () => {},
          insertBlankOption: () => {},
          getFormat: () => {},
        },
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
      },
      events: this.config.events,
    });
    if (this.config.initContent) {
      this.setContent(this.config.initContent);
    }
  }

  setContent(content) {
    this.quill.root.innerHTML = content;
  }

  getContent() {
    return this.quill.getHTML();
  }

  insertFormula(latex) {
    getImgList([`$${latex}$`]).then(objList => {
      this.quill.insertFormula(objList);
    });
  }

  getModule(module) {
    return this.quill.getModule(module);
  }

  format(format, value) {
    this.quill.format(format, value);
  }

  undo() {
    this.quill.history.undo();
  }

  redo() {
    this.quill.history.redo();
  }

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
}

export default TkEditor;
