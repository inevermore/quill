import extend from 'extend';
import Delta from 'quill-delta';
import TkBaseTheme from './tk-base';
import QlMathjax from '../formats/mathjax';
import { isContainByClass } from '../utils/dom-utils';

const LINE_SEPARATOR = '\u2028';

class Handout extends TkBaseTheme {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener('click', e => {
      const { target } = e;
      // const range = quill.getSelection();
      // if (!range) {
      //   return;
      // }

      let curNode = isContainByClass(target, QlMathjax.className, quill.root);
      if (target.tagName === 'IMG') {
        curNode = target;
      }
      if (curNode) {
        const range = document.createRange();
        range.selectNodeContents(curNode);
        const native = this.quill.selection.normalizeNative(range);
        this.quill.selection.setNativeRange(
          native.start.node,
          native.start.offset,
          native.end.node,
          native.end.offset,
        );
        if (curNode.tagName === 'IMG') {
          this.quill.setSelection(this.quill.getSelection().index, 1);
        }
      }
    });
    this.addModule('image-resizer');
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
