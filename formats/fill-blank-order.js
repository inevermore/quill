import Embed from '../blots/embed';
import Emitter from '../core/emitter';

const GUARD_TEXT = '\uFEFF';

class FillBlankOrder extends Embed {
  static create() {
    const node = super.create();
    node.setAttribute('title', '移除填空');
    node.style.fontStyle = 'normal';
    return node;
  }

  constructor(scroll, node) {
    super(scroll, node);
    this.contentNode = document.createElement('em');
    this.contentNode.setAttribute('contenteditable', false);
    Array.from(this.domNode.childNodes).forEach(childNode => {
      this.contentNode.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode(GUARD_TEXT);
    this.rightGuard = document.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(this.contentNode);
    this.domNode.appendChild(this.rightGuard);
    node.children[0].classList.add('blank-list-remove');
    this.scroll.emitter.emit(Emitter.events.ADD_FILL_BLANK_ORDER, node);
  }

  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.scroll.emitter.emit(
      Emitter.events.DELETE_FILL_BLANK_ORDER,
      this.domNode.dataset.index,
    );
  }
}

FillBlankOrder.blotName = 'fill-blank-order';
FillBlankOrder.className = 'fill-blank';
FillBlankOrder.tagName = 'SPAN';

export default FillBlankOrder;
