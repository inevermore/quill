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

export default function buildPinyin(quill) {
  const select = document.createElement('div');
  select.setAttribute('title', '插入拼音');
  select.classList.add('pinyin-select');
  select.innerHTML = `<div class="pinyin-select">
      <div class="pinyin-label">
        <span class="pinyin-placeholder">插入拼音</span>
        <span class="pinyin-arrow"></span>
      </div>
      <div class="pinyin-options options-hide"></div>
    </div>`;
  const optionsDiv = select.querySelector('.pinyin-options');
  const label = select.querySelector('.pinyin-label');
  const placeholder = select.querySelector('.pinyin-placeholder');
  // eslint-disable-next-line no-restricted-syntax
  for (const option of PINYINS) {
    const span = document.createElement('span');
    span.classList.add('pinyin-item');
    span.innerText = option;
    optionsDiv.appendChild(span);
  }
  select.appendChild(optionsDiv);
  label.addEventListener('click', () => {
    optionsDiv.classList.toggle('options-hide');
  });
  optionsDiv.addEventListener('click', ({ target }) => {
    if (target.classList.contains('pinyin-item')) {
      quill.focus();
      const { index } = quill.selection.savedRange;
      quill.insertText(index, target.innerText);
      quill.update();
      optionsDiv.classList.add('options-hide');
      placeholder.innerText = target.innerText;
    }
  });
  document.addEventListener('click', ({ target }) => {
    if (!select.contains(target)) {
      optionsDiv.classList.add('options-hide');
    }
  });
  return select;
}
