import extend from 'extend';
import Emitter from '../core/emitter';
import BaseTheme, { BaseTooltip } from './base';
import LinkBlot from '../formats/link';
import { Range } from '../core/selection';
import icons from '../ui/icons';
import LatexToImg from '../utils/latex-to-img';
import ImgToLatex from '../utils/img-to-latex';

const TOOLBAR_CONFIG = [
  ['undo', 'redo'],
  [{ 'tk-bold': 'normal' }, { italic: 'normal' }, { 'tk-strike': 'normal' }],
  [
    { 'tk-align': 'left' },
    { 'tk-align': 'center' },
    { 'tk-align': 'right' },
    { 'tk-indent': 'indent' },
    { script: 'super' },
    { script: 'sub' },
  ],
  ['all', 'clean'],
  ['image'],
  ['pi'],
  [
    // { tkFormat: 'dotted' },
    { 'tk-underline': 'normal' },
    'fillBlankUnderline',
    { 'tk-underline': 'wavy' },
  ],
  ['latexToSvg', 'svgToLatex'],
  [{ pinyin: [] }],
  // [{ dotted: 'dotted-underline' }],
];

class SnowTooltip extends BaseTooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
    this.preview = this.root.querySelector('a.ql-preview');
  }

  listen() {
    super.listen();
    this.root.querySelector('a.ql-action').addEventListener('click', event => {
      if (this.root.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit('link', this.preview.textContent);
      }
      event.preventDefault();
    });
    this.root.querySelector('a.ql-remove').addEventListener('click', event => {
      if (this.linkRange != null) {
        const range = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, 'link', false, Emitter.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(
      Emitter.events.SELECTION_CHANGE,
      (range, oldRange, source) => {
        if (range == null) return;
        if (range.length === 0 && source === Emitter.sources.USER) {
          const [link, offset] = this.quill.scroll.descendant(
            LinkBlot,
            range.index,
          );
          if (link != null) {
            this.linkRange = new Range(range.index - offset, link.length());
            const preview = LinkBlot.formats(link.domNode);
            this.preview.textContent = preview;
            this.preview.setAttribute('href', preview);
            this.show();
            this.position(this.quill.getBounds(this.linkRange));
            return;
          }
        } else {
          delete this.linkRange;
        }
        this.hide();
      },
    );
  }

  show() {
    super.show();
    this.root.removeAttribute('data-mode');
  }
}
SnowTooltip.TEMPLATE = [
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>',
].join('');

class TikuTheme extends BaseTheme {
  constructor(quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.container == null
    ) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
    this.quill.container.classList.add('ql-tiku');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    toolbar.container.classList.add('ql-tiku');
    this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
    this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
    // buildPickers.call(this, toolbar.container.querySelectorAll('select'), icons);
    this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
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
          this.quill.showFormulaEditor(true);
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
      },
    },
  },
});

export default TikuTheme;
