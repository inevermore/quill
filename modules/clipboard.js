import extend from 'extend';
import Delta from 'quill-delta';
import {
  Attributor,
  ClassAttributor,
  EmbedBlot,
  Scope,
  StyleAttributor,
  BlockBlot,
} from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';

import { AlignStyle, AlignClass } from '../formats/align';
import { SizeStyle } from '../formats/size';
import LineHeightStyle from '../formats/line-height';
import { FontStyle } from '../formats/font';
import { ColorStyle } from '../formats/color';
import { BackgroundStyle } from '../formats/background';
import CodeBlock from '../formats/code';
import { DirectionAttribute, DirectionStyle } from '../formats/direction';
import constant from '../config/constant';

const debug = logger('quill:clipboard');

const CLIPBOARD_CONFIG = [
  [Node.TEXT_NODE, matchText],
  [Node.TEXT_NODE, matchNewline],
  [Node.TEXT_NODE, matchTextLineBreak],
  // ['br', matchBreak],
  ['br', matchBreakText],
  [Node.ELEMENT_NODE, matchNewline],
  [Node.ELEMENT_NODE, matchBlot],
  [Node.ELEMENT_NODE, matchAttributor],
  [Node.ELEMENT_NODE, matchStyles],
  [Node.ELEMENT_NODE, matchTkStyles],
  // ['ol, ul', matchList],
  ['ol', matchList],
  ['td', matchTableCell],
  ['td', centerTableCell],
  ['b', matchAlias.bind(matchAlias, { bold: 'normal' })],
  ['strong', matchAlias.bind(matchAlias, { bold: 'normal' })],
  ['i', matchAlias.bind(matchAlias, { italic: 'normal' })],
  ['em', matchAlias.bind(matchAlias, { italic: 'normal' })],
  ['sup', matchAlias.bind(matchAlias, { script: 'super' })],
  ['sub', matchAlias.bind(matchAlias, { script: 'sub' })],
  ['style', matchIgnore],
  ['u', matchUnderline],
  ['s', matchAlias.bind(matchAlias, { strike: 'normal' })],
];
const ATTRIBUTE_ATTRIBUTORS = [DirectionAttribute].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});

const STYLE_ATTRIBUTORS = [
  AlignStyle,
  BackgroundStyle,
  ColorStyle,
  LineHeightStyle,
  DirectionStyle,
  FontStyle,
  SizeStyle,
].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});

const OLD_CLASS = {
  italic: 'yikespec-italic',
  indent: 'yikespec-text-indent',
  wavy: 'yikespec-line-wave',
  underline: 'yikespec-underline',
  strike: 'yikespec-line-through',
  dotted: 'yikespec-dotted',
  fillBlankBrackets: 'yikespec-bracket',
  fillBlankUnderline: 'yikespec-underline-blank',
  fillBlankOrder: 'fill-blank',
  textAlignCenter: 'yikespec-align-center',
  textAlignLeft: 'yikespec-align-left',
  textAlignRight: 'yikespec-align-right',
};
const LINE_SEPARATOR = '\u2028';

class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('copy', e => this.onCaptureCopy(e, false));
    this.quill.root.addEventListener('cut', e => this.onCaptureCopy(e, true));
    this.quill.root.addEventListener('paste', this.onCapturePaste.bind(this));
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers).forEach(
      ([selector, matcher]) => {
        this.addMatcher(selector, matcher);
      },
    );
  }

  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }

  convert({ html, text }, formats = {}) {
    if (formats[CodeBlock.blotName]) {
      return new Delta().insert(text, {
        [CodeBlock.blotName]: formats[CodeBlock.blotName],
      });
    }
    if (!html) {
      return new Delta().insert(text || '');
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const container = doc.body;
    const nodeMatches = new WeakMap();
    const [elementMatchers, textMatchers] = this.prepareMatching(
      container,
      nodeMatches,
    );
    const delta = traverse.call(
      this,
      this.quill.scroll,
      container,
      elementMatchers,
      textMatchers,
      nodeMatches,
    );
    // Remove trailing newline
    if (
      deltaEndsWith(delta, '\n') &&
      delta.ops[delta.ops.length - 1].attributes == null
    ) {
      return delta.compose(new Delta().retain(delta.length() - 1).delete(1));
    }
    return delta;
  }

  dangerouslyPasteHTML(index, html, source = Quill.sources.API) {
    if (typeof index === 'string') {
      const delta = this.convert({ html: index, text: '' });
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, Quill.sources.SILENT);
    } else {
      const paste = this.convert({ html, text: '' });
      this.quill.updateContents(
        new Delta().retain(index).concat(paste),
        source,
      );
      this.quill.setSelection(index + paste.length(), Quill.sources.SILENT);
    }
  }

  onCaptureCopy(e, isCut = false) {
    if (e.defaultPrevented) return;
    e.preventDefault();
    const [range] = this.quill.selection.getRange();
    if (range == null) return;
    const { html, text } = this.onCopy(range, isCut);
    e.clipboardData.setData('text/plain', text);
    e.clipboardData.setData('text/html', html);
    if (isCut) {
      this.quill.deleteText(range, Quill.sources.USER);
    }
  }

  onCapturePaste(e) {
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    e.preventDefault();
    const range = this.quill.getSelection(true);
    if (range == null) return;
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const files = Array.from(e.clipboardData.files || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
    } else {
      this.onPaste(range, { html, text });
    }
  }

  onCopy(range) {
    const text = this.quill.getText(range);
    const html = this.quill.getSemanticHTML(range);
    return { html, text };
  }

  onPaste(range, { text, html }) {
    const formats = this.quill.getFormat(range.index);
    // eslint-disable-next-line no-console
    console.log(html);
    const noSoftWrapHtml = html.replace(/\$([^]*?)\$/g, latex => {
      return latex.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    });
    const pastedDelta = this.convert({ text, html: noSoftWrapHtml }, formats);
    debug.log('onPaste', pastedDelta, { text, html: noSoftWrapHtml });
    const delta = new Delta()
      .retain(range.index)
      .delete(range.length)
      .concat(pastedDelta);
    this.quill.updateContents(delta, Quill.sources.USER);
    // range.length contributes to delta.length()
    this.quill.setSelection(
      delta.length() - range.length,
      Quill.sources.SILENT,
    );
    this.quill.scrollIntoView();
  }

  prepareMatching(container, nodeMatches) {
    const elementMatchers = [];
    const textMatchers = [];
    this.matchers.forEach(pair => {
      const [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach(node => {
            if (nodeMatches.has(node)) {
              const matches = nodeMatches.get(node);
              matches.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  }
}
Clipboard.DEFAULTS = {
  matchers: [],
};

function applyFormat(delta, format, value) {
  if (typeof format === 'object') {
    return Object.keys(format).reduce((newDelta, key) => {
      return applyFormat(newDelta, key, format[key]);
    }, delta);
  }
  return delta.reduce((newDelta, op) => {
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    return newDelta.insert(
      op.insert,
      extend({}, op.attributes, { [format]: value }),
    );
  }, new Delta());
}

function deltaEndsWith(delta, text) {
  let endText = '';
  for (
    let i = delta.ops.length - 1;
    i >= 0 && endText.length < text.length;
    --i // eslint-disable-line no-plusplus
  ) {
    const op = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}

function isLine(node) {
  if (node.childNodes.length === 0) return false; // Exclude embed blocks
  return [
    'address',
    'article',
    'blockquote',
    'canvas',
    'dd',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'iframe',
    'li',
    'main',
    'nav',
    'ol',
    'output',
    'p',
    'pre',
    'section',
    'table',
    'td',
    'tr',
    'ul',
    'video',
  ].includes(node.tagName.toLowerCase());
}

function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  // Post-order
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce((delta, matcher) => {
      return matcher(node, delta, scroll);
    }, new Delta());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce((delta, childNode) => {
      let childrenDelta = traverse.call(
        this,
        scroll,
        childNode,
        elementMatchers,
        textMatchers,
        nodeMatches,
      );
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
          return matcher.call(this, childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce(
          (reducedDelta, matcher) => {
            return matcher.call(this, childNode, reducedDelta, scroll);
          },
          childrenDelta,
        );
      }
      return delta.concat(childrenDelta);
    }, new Delta());
  }
  return new Delta();
}

function matchAlias(format, node, delta) {
  return applyFormat(delta, format, true);
}

function matchAttributor(node, delta, scroll) {
  const attributes = Attributor.keys(node);
  const classes = ClassAttributor.keys(node);
  const styles = StyleAttributor.keys(node);
  const formats = {};
  attributes
    .concat(classes)
    .concat(styles)
    .forEach(name => {
      let attr = scroll.query(name, Scope.ATTRIBUTE);
      if (attr != null) {
        formats[attr.attrName] = attr.value(node);
        if (formats[attr.attrName]) return;
      }
      attr = ATTRIBUTE_ATTRIBUTORS[name];
      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        formats[attr.attrName] = attr.value(node) || undefined;
      }
      attr = STYLE_ATTRIBUTORS[name];
      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        attr = STYLE_ATTRIBUTORS[name];
        formats[attr.attrName] = attr.value(node) || undefined;
      }
    });
  if (Object.keys(formats).length > 0) {
    return applyFormat(delta, formats);
  }
  return delta;
}

function matchBlot(node, delta, scroll) {
  const match = scroll.query(node);
  if (match == null) return delta;
  if (match.prototype instanceof EmbedBlot) {
    const embed = {};
    const value = match.value(node);
    if (value != null) {
      embed[match.blotName] = value;
      return new Delta().insert(embed, match.formats(node, scroll));
    }
  } else {
    if (match.prototype instanceof BlockBlot && !deltaEndsWith(delta, '\n')) {
      delta.insert('\n');
    }
    if (typeof match.formats === 'function') {
      return applyFormat(delta, match.blotName, match.formats(node, scroll));
    }
  }
  return delta;
}

// function matchBreak(node, delta) {
//   if (!deltaEndsWith(delta, '\n')) {
//     delta.insert('\n');
//   }
//   return delta;
// }

function matchBreakText(node, delta) {
  //
  if (node.nextSibling && node.nextSibling.textContent.startsWith('\n')) {
    return new Delta().insert(LINE_SEPARATOR);
  }
  delta.insert('\n');
  return delta;
}

// function matchCodeBlock(node, delta, scroll) {
//   const match = scroll.query('code-block');
//   const language = match ? match.formats(node, scroll) : true;
//   return applyFormat(delta, 'code-block', language);
// }

function matchIgnore() {
  return new Delta();
}

// function matchIndent(node, delta, scroll) {
//   const match = scroll.query(node);
//   if (
//     match == null ||
//     match.blotName !== 'list' ||
//     !deltaEndsWith(delta, '\n')
//   ) {
//     return delta;
//   }
//   let indent = -1;
//   let parent = node.parentNode;
//   while (parent != null) {
//     if (['OL', 'UL'].includes(parent.tagName)) {
//       indent += 1;
//     }
//     parent = parent.parentNode;
//   }
//   if (indent <= 0) return delta;
//   return delta.compose(
//     new Delta().retain(delta.length() - 1).retain(1, { indent }),
//   );
// }

function matchList(node, delta) {
  const list = node.tagName === 'OL' ? 'ordered' : 'bullet';
  return applyFormat(delta, 'list', list);
}

function matchStyles(node, delta) {
  const formats = {};
  const style = node.style || {};
  if (
    style.fontWeight.startsWith('bold') ||
    parseInt(style.fontWeight, 10) >= 700
  ) {
    formats.bold = 'normal';
  }
  if (parseFloat(style.textIndent || 0) > 0) {
    // Could be 0.5in
    formats['text-indent'] = 'normal';
  }
  if (Object.keys(formats).length > 0) {
    delta = applyFormat(delta, formats);
  }

  return delta;
}

function matchTkStyles(node, delta) {
  const formats = {};
  const style = node.style || {};
  const classList = node.classList || {};
  if (style.fontStyle === 'italic' || classList.contains(OLD_CLASS.italic)) {
    formats.italic = 'normal';
  }
  if (
    getStyle(node, 'font-emphasize').indexOf('dot') > -1 ||
    classList.contains(OLD_CLASS.dotted)
  ) {
    formats.dotted = 'normal';
  }
  if (classList.contains(OLD_CLASS.wavy)) {
    formats.underline = 'wavy';
  }
  if (classList.contains(OLD_CLASS.underline)) {
    formats.underline = 'normal';
  }
  if (classList.contains(OLD_CLASS.strike)) {
    formats.strike = 'normal';
  }
  if (classList.contains(OLD_CLASS.fillBlankBrackets)) {
    return new Delta().insert({
      'embed-text': this.quill.embedTextMap.FILL_BLANK_BRACKETS,
    });
  }
  if (classList.contains(OLD_CLASS.fillBlankUnderline)) {
    return new Delta().insert({
      'embed-text': this.quill.embedTextMap.FILL_BLANK_UNDERLINE,
    });
  }
  if (classList.contains(OLD_CLASS.fillBlankOrder)) {
    return new Delta().insert({ 'fill-blank-order': {} });
  }
  if (classList.contains(OLD_CLASS.textAlignCenter)) {
    formats.align = 'center';
  }
  if (classList.contains(OLD_CLASS.textAlignLeft)) {
    formats.align = 'left';
  }
  if (classList.contains(OLD_CLASS.textAlignRight)) {
    formats.align = 'right';
  }
  if (
    parseFloat(getStyle(node, 'text-indent') || 0) > 0 ||
    classList.contains(OLD_CLASS.indent)
  ) {
    formats['text-indent'] = 'normal';
  }
  if (Object.keys(formats).length > 0) {
    delta = applyFormat(delta, formats);
  }
  return delta;
}

function matchTableCell(node, delta) {
  const tr = node.parentNode;
  const table =
    tr.parentNode.tagName === 'TABLE'
      ? tr.parentNode
      : tr.parentNode.parentNode;
  const rows = Array.from(table.querySelectorAll('tr'));
  const row = rows.indexOf(tr) + 1;
  const tbalign =
    table.getAttribute('table-align') || table.getAttribute('align');
  const cells = Array.from(tr.querySelectorAll('td'));
  let applyDelta = delta;
  if (delta && delta.ops.length === 0) {
    applyDelta = new Delta().insert('\n');
  }
  const format = {
    row,
    tbalign,
    cell: cells.indexOf(node) + 1,
    align: AlignClass.value(node) || 'center',
    diagonal:
      (node.classList.contains(constant.tableDiagonalClass) && 'normal') || '',
  };
  const { rowSpan, colSpan } = node;
  if (rowSpan > 1) {
    format.rowspan = rowSpan;
  }
  if (colSpan > 1) {
    format.colspan = colSpan;
  }
  return applyFormat(applyDelta, 'table-cell-line', format);
}

function centerTableCell(node, delta) {
  // return delta;
  return applyFormat(delta, 'align', AlignClass.value(node) || 'center');
}

function matchText(node, delta) {
  const text = node.data;
  // Word represents empty line with <o:p>&nbsp;</o:p>
  if (node.parentNode.tagName === 'O:P') {
    return delta.insert(text.trim());
  }
  if (text.trim().length === 0 && text.includes('\n')) {
    return delta;
  }

  return delta.insert(text);
}

function matchNewline(node, delta) {
  if (!deltaEndsWith(delta, '\n')) {
    if (
      isLine(node) ||
      (delta.length() > 0 && node.nextSibling && isLine(node.nextSibling))
    ) {
      delta.insert('\n');
    }
  }
  return delta;
}

function matchTextLineBreak(node, delta) {
  // eslint-disable-next-line no-plusplus
  for (let i = delta.ops.length - 1; i >= 0; i--) {
    const op = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    op.insert = op.insert
      .replace(/\n$/g, '')
      .replace(/^\n/g, '')
      .replace(/\n\n$/, LINE_SEPARATOR)
      .replace(/\n/g, LINE_SEPARATOR);
  }
  return delta;
}

function matchUnderline(node, delta) {
  let value = 'normal';
  if (getStyle(node, 'text-underline').indexOf('wave') > -1) {
    value = 'wavy';
  }
  return applyFormat(delta, 'underline', value);
}

function getStyle(node, key) {
  const styleText = node.getAttribute('style');
  if (typeof styleText === 'string') {
    const styles = styleText.replace(/\s/g, '').split(';') || [];
    const style = styles.find(item => {
      const kv = item.split(':');
      return key === kv[0];
    });
    return (style && style.split(':')[1]) || '';
  }
  return '';
}

export {
  Clipboard as default,
  matchAttributor,
  matchBlot,
  matchNewline,
  matchText,
  traverse,
};
