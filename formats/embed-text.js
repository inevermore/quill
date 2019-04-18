import Embed from '../blots/embed';

class EmbedText extends Embed {
  static create(value) {
    const node = super.create();
    node.innerText = value.text;
    node.classList.add(value.className);
    return node;
  }

  static value(node) {
    const className = Array.from(node.classList).find(
      item => item !== 'tkspec-embed-text',
    );
    const text = node.children[0].innerText;
    return {
      className,
      text,
    };
  }
}

EmbedText.blotName = 'embed-text';
EmbedText.tagName = 'SPAN';
EmbedText.className = 'tkspec-embed-text';

export default EmbedText;
