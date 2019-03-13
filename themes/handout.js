import TkBaseTheme from './tk-base';
import QlMathjax from '../formats/mathjax';

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

export default Handout;
