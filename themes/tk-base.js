import BaseTheme from './base';
import icons from '../ui/icons';

class TikuBaseTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-tiku');
    options.modules.toolbar.options.forEach(option => {
      if (Array.isArray(option)) {
        option.forEach(item => {
          if (typeof item !== 'object') {
            return;
          }

          Object.keys(item).forEach(key => {
            const format = quill.imports[`formats/${key}`];
            if (format == null) {
              return;
            }
            if (Array.isArray(item[key])) {
              format.whitelist = item[key];
            } else if (Array.isArray(format.whitelist)) {
              if (format.whitelist.indexOf(item[key]) === -1) {
                format.whitelist.push(item[key]);
              }
            } else {
              format.whitelist = [item[key]];
            }
          });
        });
      } else if (typeof option === 'object') {
        Object.keys(option).forEach(key => {
          const format = quill.imports[`formats/${key}`];
          if (format == null) {
            return;
          }
          format.whitelist = option[key] || null;
        });
      }
    });
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-tiku');
    this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
    this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
  }
}

export default TikuBaseTheme;
