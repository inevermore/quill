import Embed from '../blots/embed';
import CustomEmitter from '../utils/custom-emitter';

class FillBlankOrder extends Embed {
  static create() {
    const node = super.create();
    node.setAttribute('title', '移除填空');
    node.style.fontStyle = 'normal';
    CustomEmitter.emit(CustomEmitter.events.ADD_FILL_BLANK_ORDER, node);
    return node;
  }

  deleteAt(index, length) {
    super.deleteAt(index, length);
    CustomEmitter.emit(
      CustomEmitter.events.DELETE_FILL_BLANK_ORDER,
      this.domNode.dataset.index,
    );
  }
}

FillBlankOrder.blotName = 'fill-blank-order';
FillBlankOrder.className = 'tkspec-fill-blank-order';
FillBlankOrder.tagName = 'SPAN';

export default FillBlankOrder;
