import TextBlot from '../blots/text';

const LINE_SEPARATOR = '\u2028';

class TextLineBreak extends TextBlot {
  constructor(scroll, node) {
    super(scroll, node);
    this.setText(this.text);
  }

  /**
   * @param {Text} domNode
   * @return {string}
   */
  static value(domNode) {
    return toDeltaText(TextBlot.value(domNode));
  }

  /**
   * @param {number} index
   * @param {string} value
   */
  deleteAt(index, length) {
    this.setText(this.text.slice(0, index) + this.text.slice(index + length));
  }

  /**
   * @param {number} index
   * @param {string} value
   * @param {*=} def specify to treat inserted value as an embed?
   */
  insertAt(index, value, def) {
    if (def == null) {
      this.setText(this.text.slice(0, index) + value + this.text.slice(index));
    } else {
      super.insertAt(index, value, def);
    }
  }

  /**
   * @private
   * @param {value} deltaText
   */
  setText(deltaText) {
    this.text = deltaText;
    this.domNode.data = toDomText(deltaText);
  }
}

/**
 * @param {string} domText
 * @return {string} the Delta-text equivalent of domText
 */
function toDeltaText(domText) {
  return (
    domText
      // Text node content that ends in \n\n is rendered as two blank lines.
      // Convert to one line separator, only. Assume the second blank line
      // will be handled by the \n that marks the end of all paragraphs in Quill.
      .replace(/\n\n$/, LINE_SEPARATOR)
      .replace(/\n/g, LINE_SEPARATOR)
  );
}

/**
 * @param {string} deltaText
 * @return {string} the DOM-text equivalent of deltaText
 */
function toDomText(deltaText) {
  return deltaText
    .replace(new RegExp(`${LINE_SEPARATOR}$`), '\n\n')
    .replace(new RegExp(LINE_SEPARATOR, 'g'), '\n');
}

export default TextLineBreak;
