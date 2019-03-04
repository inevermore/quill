import extend from 'extend';
import TkBaseTheme from './tk-base';
import LatexToImg from '../utils/latex-to-img';
import ImgToLatex from '../utils/img-to-latex';
import uploadImage from '../utils/upload-image';

// const PICKERS = ['size', 'font'];

const TOOLBAR_CONFIG = [
  ['undo', 'redo'],
  ['all', 'clean'],
  [
    { bold: 'normal' },
    { italic: 'normal' },
    { strike: 'normal' },
    { underline: 'normal' },
    { underline: 'wavy' },
    { dotted: 'circle' },
    { script: 'super' },
    { script: 'sub' },
  ],
  [
    { align: 'left' },
    { align: 'center' },
    { align: 'right' },
    { indent: 'normal' },
  ],
  ['image', 'fill-blank-underline', 'fill-blank-brackets'],
  ['pi', 'latexToSvg', 'svgToLatex'],
  [{ pinyin: [] }],
];

class TikuTheme extends TkBaseTheme {
  constructor(quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.options == null
    ) {
      options.modules.toolbar.options = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
    this.addModule('image-resizer');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
  }
}

TikuTheme.DEFAULTS = extend(true, {}, TkBaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        redo() {
          this.quill.history.redo();
        },
        undo() {
          this.quill.history.undo();
        },
        all() {
          this.quill.setSelection(0, this.quill.getLength());
        },
        pi() {
          // this.quill.tkEvents.openFormula();
        },
        svgToLatex() {
          ImgToLatex(this.quill);
        },
        latexToSvg() {
          LatexToImg(this.quill, false);
        },
        'fill-blank-underline': function() {
          const savedIndex = this.quill.selection.savedRange.index;
          this.quill.insertEmbed(savedIndex, 'fill-blank-underline', {});
        },
        pinyin(value) {
          const savedIndex = this.quill.selection.savedRange.index;
          this.quill.insertText(savedIndex, value);
        },
        'fill-blank-brackets': function() {
          const savedIndex = this.quill.selection.savedRange.index;
          this.quill.insertText(savedIndex, '（   ）');
        },
      },
    },
    table: true,
    uploader: {
      handler: uploadImage,
    },
  },
});

export default TikuTheme;
