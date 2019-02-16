import Tiku from './tiku';

class Handout extends Tiku {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.style.border = 'none';
  }

  extendToolbar(toolbar) {
    super.extendToolbar(toolbar);
    toolbar.container.style.display = 'none';
  }
}

export default Handout;
