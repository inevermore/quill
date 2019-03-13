import Embed from '../blots/embed';

class FormulaEmbed extends Embed {
  static create(value) {
    const node = super.create();
    node.innerHTML = value.innerHTML;
    node.setAttribute('latex', value.latex);
    node.setAttribute('mathid', value.mathid);
    // node.querySelector('svg').setAttribute('contenteditable', false);
    return node;
  }

  static value(node) {
    return {
      latex: node.getAttribute('latex'),
      mathid: node.getAttribute('mathid'),
      innerHTML: node.innerHTML,
    };
  }
}

FormulaEmbed.blotName = 'ql-mathjax';
FormulaEmbed.className = 'ql-mathjax';
FormulaEmbed.tagName = 'span';

export default FormulaEmbed;
