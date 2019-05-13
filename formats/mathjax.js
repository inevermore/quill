import Embed from '../blots/embed';

class FormulaEmbed extends Embed {
  static create(value) {
    const node = super.create();
    node.innerHTML = value.innerHTML;
    node.setAttribute('latex', value.latex);
    node.setAttribute('mathid', value.mathid);
    // node.setAttribute('contenteditable', false);
    node.setAttribute('tabindex', -1);
    return node;
  }

  static value(node) {
    const svg = node.querySelector('svg');
    return {
      latex: node.getAttribute('latex'),
      mathid: node.getAttribute('mathid'),
      innerHTML: svg.outerHTML,
    };
  }
}

FormulaEmbed.blotName = 'ql-mathjax';
FormulaEmbed.className = 'ql-mathjax';
FormulaEmbed.tagName = 'span';

export default FormulaEmbed;
