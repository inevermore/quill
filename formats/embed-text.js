import Embed from '../blots/embed';

const CLASS_NAME = 'tkspec-embed-text';
class EmbedText extends Embed {
  static create(value) {
    const node = super.create();
    node.innerHTML = value.text;
    node.classList.add(value.className);
    return node;
  }

  static value(node) {
    const className = Array.from(node.classList).find(
      item => item !== CLASS_NAME,
    );
    let text = '';
    if (node.children[0]) {
      text = node.children[0].innerText;
    } else {
      text = node.innerText;
    }
    return {
      className,
      text,
    };
  }
}

EmbedText.blotName = 'embed-text';
EmbedText.tagName = 'SPAN';
EmbedText.className = CLASS_NAME;

export default EmbedText;
