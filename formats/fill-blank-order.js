import Embed from '../blots/embed';
import Emitter from '../core/emitter';

class FillBlankOrder extends Embed {
  static create() {
    const node = super.create();
    node.setAttribute('title', '移除填空');
    node.style.fontStyle = 'normal';
    return node;
  }

  constructor(scroll, node, value) {
    super(scroll, node, value);
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
FillBlankOrder.className = 'tkspec-fill-blank-order';
FillBlankOrder.tagName = 'SPAN';

export default FillBlankOrder;
