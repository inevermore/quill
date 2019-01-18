import Embed from '../blots/embed';

class FillBlankUnderline extends Embed {
  static create(value) {
    const node = super.create(value);
    node.innerHTML = `<i contenteditable="false">${this.generateSpace(
      32,
    )}</i>&zwj;`;
    return node;
  }

  static generateSpace(count) {
    let str = '';
    for (let i = 0; i < count; i += 1) {
      str += '&nbsp;';
    }
    return str;
  }
}

FillBlankUnderline.blotName = 'fill-blank-underline';
FillBlankUnderline.className = 'yikespec-underline-blank';
FillBlankUnderline.tagName = 'SPAN';

export default FillBlankUnderline;
