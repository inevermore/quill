import Picker from './picker';

class TextPicker extends Picker {
  constructor(select, label) {
    super(select);
    this.label.innerHTML = label;
    this.container.classList.add('ql-text-picker');
  }

  buildItem(option) {
    const item = super.buildItem(option);
    item.innerText = option.getAttribute('value');
    return item;
  }
}

export default TextPicker;
