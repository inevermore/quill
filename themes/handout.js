import extend from 'extend';
import Delta from 'quill-delta';
import TkBaseTheme from './tk-base';
import QlMathjax from '../formats/mathjax';

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
    this.quill.container.classList.add('text-editor-wrapper');
  }

  extendToolbar(toolbar) {
    toolbar.container.parentNode.removeChild(toolbar.container);
  }
}

Handout.DEFAULTS = extend(true, {}, TkBaseTheme.DEFAULTS, {
  modules: {
    keyboard: {
      bindings: {
        shiftEnter: {
          key: 'Enter',
          shiftKey: true,
          // eslint-disable-next-line object-shorthand
          handler: function(range) {
            if (this.quill.enableSingleLine) {
              return;
            }
            // Insert LINE_SEPARATOR at cursor position
            this.quill.history.cutoff();
            const delta = new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert(LINE_SEPARATOR);
            this.quill.updateContents(delta, 'user');
            this.quill.history.cutoff();

            // Position cursor after inserted linebreak
            this.quill.setSelection(range.index + 1, 'silent');
          },
        },
      },
    },
  },
});

export default Handout;
