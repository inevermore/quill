import extend from 'extend';
import Quill from './tk-quill';

class TkEditor {
  constructor(options) {
    this.config = extend(
      true,
      {
        container: document.body,
        toolbar: {
          container: null,
          options: [],
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
    this.defaultStyle = '';
    this.quill = new Quill(createContainer(this.config), {
      theme: this.config.theme,
      modules: {
        toolbar: {
          container: this.config.toolbar.container,
          options: this.config.toolbar.options,
        },
      },
      events: this.config.events,
    });
    if (this.config.initContent) {
      // this.setContent(this.config.initContent);
    }
  }

  setContent(content) {
    this.quill.root.innerHTML = content;
  }

  getContent() {
    // if (this.config.theme === 'handout') {
    //   return `<div style="${this.defaultStyle}">${this.quill.getHTML()}</div>`;
    // }
    return this.quill.getHTML();
  }

  insertFormula(objList) {
    this.quill.insertFormula(objList);
  }

  getModule(module) {
    return this.quill.getModule(module);
  }

  format(format, value) {
    this.quill.getModule('toolbar').formatContent(format, value);
  }
}

function createContainer(config) {
  let { container } = config;
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  container.appendChild(wrapper);
  const editedArea = document.createElement('div');
  editedArea.style.flex = 1;
  editedArea.style.height = 'auto';
  wrapper.appendChild(editedArea);
  return editedArea;
}

export default TkEditor;
