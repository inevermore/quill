import extend from 'extend';
import Emitter from '../core/emitter';
import BaseTheme, { BaseTooltip } from './base';
import LinkBlot from '../formats/link';
import { Range } from '../core/selection';
import icons from '../ui/icons';
import LatexToImg from '../utils/latex-to-img';
import ImgToLatex from '../utils/img-to-latex';
import uploadImage from '../utils/upload-image';

const PICKERS = ['size', 'font'];

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
  ['image', 'fillBlankUnderline', 'fill-blank-brackets'],
  ['pi', 'latexToSvg', 'svgToLatex'],
  [{ pinyin: [] }],
];

class TikuTheme extends BaseTheme {
  constructor(quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.options == null
    ) {
      options.modules.toolbar.options = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
    this.quill.container.classList.add('ql-tiku');
    console.log(quill.imports, options);
    options.modules.toolbar.options.forEach(option => {
      option.forEach(item => {
        if (typeof item === 'object') {
          Object.keys(item).forEach(key => {
            if (PICKERS.indexOf(key) > -1 && Array.isArray(item[key])) {
              quill.imports[`formats/${key}`].whitelist = item[key];
            }
          });
        }
      });
    });
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    toolbar.container.classList.add('ql-tiku');
    this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
    this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
    if (toolbar.container.querySelector('.ql-link')) {
      this.quill.keyboard.addBinding(
        { key: 'k', shortKey: true },
        (range, context) => {
          toolbar.handlers.link.call(toolbar, !context.format.link);
        },
      );
    }
  }

  static getSelectIndex() {
    return this.quill.selection.savedRange.index;
  }
}

TikuTheme.DEFAULTS = extend(true, {}, BaseTheme.DEFAULTS, {
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
          this.quill.tkEvents.openFormula();
        },
        svgToLatex() {
          ImgToLatex(this.quill);
        },
        latexToSvg() {
          LatexToImg(this.quill, false);
        },
        fillBlankUnderline() {
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
