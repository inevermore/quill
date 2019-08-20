/* eslint-disable no-alert */
import extend from 'extend';
import Delta from 'quill-delta';
import TkBaseTheme from './tk-base';
import svgToLatex from '../utils/svg-to-latex';
import { isContainByClass, getTdParent } from '../utils/dom-utils';
import Emitter from '../core/emitter';
import debounce from '../utils/debounce';
import FillBlankOrder from '../formats/fill-blank-order';
import QlMathjax from '../formats/mathjax';
import titles from '../config/titles';
import tableInsert from '../ui/build-table-insert';

const TOOLBAR_CONFIG = [
  ['undo', 'redo'],
  ['all', 'clean'],
  [
    { bold: 'normal' },
    { italic: 'normal' },
    { strike: 'normal' },
    { underline: 'normal' },
    { underline: 'wavy' },
    { dotted: 'normal' },
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
    // 支持自定义toolbar 按钮 title
    const toolbarTitles = Object.entries(options.modules.toolbar.config).reduce(
      (memo, [key, value]) => {
        if (typeof value === 'object' && value.title) {
          memo[key] = value.title;
        }
        return memo;
      },
      {},
    );
    this.titles = extend(true, titles, toolbarTitles);
    this.quill.container.classList.add('ql-snow');
    this.quill.container.classList.add('text-editor-wrapper');
    quill.root.addEventListener('dblclick', e => {
      e.preventDefault();
      e.stopPropagation();
      let node = isContainByClass(e.target, quill.formulaImgClass, quill.root);
      if (!node && e.target.tagName.toUpperCase() === 'SVG') {
        node = e.target.parentNode.parentNode;
      }
      if (node) {
        quill.editFormula(node);
      }
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE, () => {
      this.optimizeTableSelection();
    });
    this.handleEvents();
    this.addModule('image-resizer');
  }

  extendToolbar(toolbar) {
    super.extendToolbar(toolbar);
    toolbar.container.classList.add('ql-snow');
  }

  handleEvents() {
    const { root } = this.quill;
    const deleteIndex = [];
    const addNodes = [];
    const nodes = root.getElementsByClassName(FillBlankOrder.className);
    this.quill.emitter.on(Emitter.events.ADD_FILL_BLANK_ORDER, addNode => {
      addNodes.push(addNode);
    });
    this.quill.emitter.on(Emitter.events.DELETE_FILL_BLANK_ORDER, index => {
      deleteIndex.push(index);
      debounce(() => {
        if (deleteIndex.length > 0) {
          this.blankOrderChange('del', deleteIndex, nodes.length);
          deleteIndex.length = 0;
        }
      }, 20).call(this);
    });
    this.quill.emitter.on(Emitter.events.EDITOR_CHANGE, type => {
      if (type === Emitter.events.TEXT_CHANGE) {
        // set attribute and innerText
        Array.from(nodes).forEach((node, index) => {
          node.children[0].innerText = index + 1;
          node.dataset.index = index + 1;
          node.id = index;
        });
        const addNodesIndex = Array.from(addNodes).map(
          node => node.dataset.index,
        );
        if (addNodesIndex.length > 0) {
          this.blankOrderChange('add', addNodesIndex, nodes.length);
          addNodes.length = 0;
        }
      }
    });
    let mathjaxNode = null;
    root.addEventListener('click', ({ target }) => {
      const fillBlankOrderNode = isContainByClass(
        target,
        FillBlankOrder.className,
        root,
      );
      if (fillBlankOrderNode) {
        const { index } = this.quill.getSelection();
        this.quill.deleteText(index, 1);
      }
      if (mathjaxNode) {
        mathjaxNode.classList.remove('selected');
      }
      const curMathjaxNode = isContainByClass(
        target,
        QlMathjax.className,
        root,
      );
      let curNode = null;
      if (curMathjaxNode) {
        mathjaxNode = curMathjaxNode;
        curNode = curMathjaxNode;
        mathjaxNode.classList.add('selected');
      } else if (target.tagName === 'IMG') {
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
  }

  // 设置按钮 title
  buildButtons(buttons) {
    Array.from(buttons).forEach(button => {
      const className = button.getAttribute('class') || '';
      className.split(/\s+/).forEach(name => {
        if (!name.startsWith('ql-')) return;
        name = name.slice('ql-'.length);
        if (this.titles[name] == null) return;
        if (typeof this.titles[name] === 'string') {
          button.title = this.titles[name];
        } else {
          const value = button.value || '';
          if (value != null && this.titles[name][value]) {
            button.title = this.titles[name][value];
          }
        }
      });
    });
  }

  blankOrderChange(type, changeList, len) {
    try {
      this.quill.tkEvents.blankOrderChange(type, changeList, len);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  optimizeTableSelection() {
    const nativeRange = this.quill.selection.getNativeRange();
    if (!nativeRange) return;
    const { start, end } = nativeRange;
    const startTd = getTdParent(start.node);
    const endTd = getTdParent(end.node);
    let selectionStartNode = null;
    // 选中两个td
    if (startTd && endTd && startTd !== endTd) {
      selectionStartNode = startTd;
    }
    if (selectionStartNode) {
      this.quill.selection.setNativeRange(selectionStartNode, 0);
    }
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
        clear() {
          if (window.confirm('确定清空当前文档么？')) {
            this.quill.setContents([]);
            this.quill.tkEvents.blankOrderChange('clear', [], 0);
          }
        },
        'select-all': function() {
          this.quill.setSelection(0, this.quill.getLength());
        },
        'formula-editor': function() {
          this.quill.showFormulaEditor();
        },
        svg2latex() {
          svgToLatex(this.quill);
        },
        latex2svg() {
          this.quill.latex2svg();
        },
        'fill-blank-underline': function() {
          const { index, length } = this.quill.selection.savedRange;
          const update = new Delta()
            .retain(index)
            .delete(length)
            .insert({
              'embed-text': this.quill.embedTextMap.FILL_BLANK_UNDERLINE,
            });
          this.quill.updateContents(update, Emitter.sources.USER);
          this.quill.setSelection(index + 1, 0);
        },
        pinyin(value) {
          const savedIndex = this.quill.selection.savedRange.index;
          this.quill.insertText(savedIndex, value);
        },
        'fill-blank-brackets': function() {
          const { index, length } = this.quill.selection.savedRange;
          const update = new Delta()
            .retain(index)
            .delete(length)
            .insert({
              'embed-text': this.quill.embedTextMap.FILL_BLANK_BRACKETS,
            });
          this.quill.updateContents(update, Emitter.sources.USER);
          this.quill.setSelection(index + 1, 0);
        },
        'fill-blank-order': function() {
          const { index, length } = this.quill.selection.savedRange;
          const update = new Delta()
            .retain(index)
            .delete(length)
            .insert({
              'fill-blank-order': '1',
            });
          this.quill.updateContents(update, Emitter.sources.USER);
          this.quill.setSelection(index + 1, 0);
        },
        'table-insert': function() {
          tableInsert.show(this.quill);
        },
      },
    },
    table: true,
    keyboard: {
      bindings: {
        openFormula: {
          key: 'm',
          ctrlKey: true,
          handler() {
            this.quill.showFormulaEditor();
          },
        },
        latex2svg: {
          key: 's',
          altKey: true,
          handler() {
            this.quill.latex2svg();
          },
        },
        svg2latex: {
          key: 'x',
          altKey: true,
          handler() {
            svgToLatex(this.quill);
          },
        },
      },
    },
  },
});

export default TikuTheme;
