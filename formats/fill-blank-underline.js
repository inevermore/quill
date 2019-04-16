import Embed from '../blots/embed';

class FillBlankUnderline extends Embed {
  static create(value) {
    const node = super.create(value);
    node.innerHTML = `${this.generateSpace(8)}`;
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
FillBlankUnderline.className = 'tkspec-fill-blank';
FillBlankUnderline.tagName = 'SPAN';

export default FillBlankUnderline;
