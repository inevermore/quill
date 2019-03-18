import extend from 'extend';
import Delta from 'quill-delta';
import TkBaseTheme from './tk-base';
import QlMathjax from '../formats/mathjax';
import Quill from '../core/quill';

const LINE_SEPARATOR = '\u2028';

class Handout extends TkBaseTheme {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener('click', e => {
      let { target } = e;
      const range = quill.getSelection();
      if (!range) {
        return;
      }

      while (quill.root.contains(target)) {
        if (target.classList.contains(QlMathjax.className)) {
          quill.setSelection(range.index, 1);
          break;
        } else {
          target = target.parentNode;
        }
      }
    });
  }

  extendToolbar(toolbar) {
    toolbar.container.parentNode.removeChild(toolbar.container);
  }
}

Handout.DEFAULTS = extend(true, {}, TkBaseTheme.DEFAULTS, {
  modules: {
    keyboard: {
      bindings: {
        'shift enter': {
          key: 13,
          shiftKey: true,
          // eslint-disable-next-line object-shorthand
          handler: function(range) {
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

export default Handout;
