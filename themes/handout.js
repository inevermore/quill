import TkBaseTheme from './tk-base';

class Handout extends TkBaseTheme {
  extendToolbar(toolbar) {
    toolbar.container.parentNode.removeChild(toolbar.container);
  }
}

export default Handout;
