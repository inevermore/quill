const PINYINS = [
  'ā',
  'á',
  'ǎ',
  'à',
  'ō',
  'ó',
  'ǒ',
  'ò',
  'ē',
  'é',
  'ě',
  'è',
  'ī',
  'í',
  'ǐ',
  'ì',
  'ū',
  'ú',
  'ǔ',
  'ù',
  'ǖ',
  'ǘ',
  'ǚ',
  'ǜ',
  'ü',
];

class PinyinOptions {
  constructor() {
    this.button = null;
    this.container = this.init();
    this.container.addEventListener('click', ({ target }) => {
      if (
        target.classList.contains('pinyin-item') &&
        typeof this.insert === 'function'
      ) {
        this.insert(target.innerText);
        this.hide();
      }
    });
    document.addEventListener('click', ({ target }) => {
      if (
        !(
          (this.button && this.button.contains(target)) ||
          this.container.contains(target)
        )
      ) {
        this.hide();
      }
    });
    document.addEventListener('scroll', () => {
      this.hide();
    });
    document.body.appendChild(this.container);
  }

  init() {
    const container = document.createElement('div');
    container.classList.add('pinyin-options');
    // eslint-disable-next-line no-restricted-syntax
    for (const option of PINYINS) {
      const span = document.createElement('span');
      span.classList.add('pinyin-item');
      span.innerText = option;
      container.appendChild(span);
    }
    return container;
  }

  show(insert, button) {
    this.insert = insert;
    this.button = button;
    this.container.style.display = 'flex';
    this.setPosition();
  }

  hide() {
    this.button = null;
    this.container.style.display = 'none';
  }

  setPosition() {
    const btnRect = this.button.getBoundingClientRect();
    this.container.style.left = `${btnRect.left}px`;
    this.container.style.top = `${btnRect.top + btnRect.height}px`;
  }
}

const pinyinOptions = new PinyinOptions();

export default function buildPinyin(quill) {
  const select = document.createElement('div');
  select.setAttribute('title', '插入拼音');
  select.classList.add('pinyin-select');
  select.innerHTML = `<div class="pinyin-select">
      <div class="pinyin-label">
        <span class="pinyin-placeholder">插入拼音</span>
        <span class="pinyin-arrow"></span>
      </div>
    </div>`;

  select.addEventListener('click', () => {
    pinyinOptions.show(insertPinyin, select);
  });

  function insertPinyin(text) {
    const { index } = quill.selection.savedRange;
    quill.insertText(index, text);
    quill.setSelection(index + 1, 0);
    quill.update();
    select.querySelector('.pinyin-placeholder').innerText = text;
  }
  return select;
}
