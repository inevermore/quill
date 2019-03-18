import extend from 'extend';
import Delta from 'quill-delta';
import BaseTheme from './base';
import icons from '../ui/icons';
import Quill from '../core/quill';

const LINE_SEPARATOR = '\u2028';

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
              format.whitelist.push(item[key]);
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

TikuBaseTheme.DEFAULTS = extend(true, {}, BaseTheme.DEFAULTS, {
  modules: {
    keyboard: {
      bindings: {
        shiftEnter: {
          key: 'Enter',
          shiftKey: true,
          // eslint-disable-next-line object-shorthand
          handler: function(range) {
            console.log('shift enter');
            // Insert LINE_SEPARATOR at cursor position
            this.quill.history.cutoff();
            const delta = new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert(LINE_SEPARATOR);
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.history.cutoff();

            // Position cursor after inserted linebreak
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          },
        },
      },
    },
  },
});

export default TikuBaseTheme;
