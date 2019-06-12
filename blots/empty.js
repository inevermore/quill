import { EmbedBlot } from 'parchment';

class ParagraphMark extends EmbedBlot {
  static value() {
    return undefined;
  }

  optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  }

  length() {
    return 0;
  }

  value() {
    return '';
  }
}
ParagraphMark.blotName = 'paragraph-mark';
ParagraphMark.tagName = 'span';
ParagraphMark.className = 'paragraph-mark';

export default ParagraphMark;
