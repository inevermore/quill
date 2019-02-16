// import Quill from './tk-quill';
import Editor from './index';

const editor = new Editor({
  container: '#editor',
  theme: 'handout',
  initContent:
    '<p class="yikespec-align-right">awef</p><p class="yikespec-align-center">awegawegawef</p><p class="yikespec-align-left">aweg</p><p><i class="yikespec-italic">awe12312</i></p><p><span class="yikespec-line-through">awefa</span></p><p><span class="yikespec-dotted">a</span><span class="yikespec-dotted">w</span><span class="yikespec-dotted">3</span><span class="yikespec-dotted">4</span><span class="yikespec-dotted">5</span><span class="yikespec-dotted">2</span></p><p><span class="yikespec-underline">awefaeg</span></p><p><span class="yikespec-line-wave">awegawef</span></p><p><span class="yikespec-underline-blank" contenteditable="false" ondblclick="javascript:this.removeAttribute(`contenteditable`);this.setAttribute(`class`, `yikespec-underline-custom`);">&nbsp;&nbsp;&nbsp;&nbsp;</span></p><p>a<i class="yikespec-italic"><span class="yikespec-line-through" style="">wefaawfawego;awe gawoeg; awergi; awe g;awejog awe flaweg;o awje噶伟； 噶伟；额哦个啊；完额改为发我恶搞；哦额艾薇儿乏味噶卫刚阿恶搞啊未分啊卫刚啊卫刚啊卫刚啊额卫刚</span></i></p>',
  toolbar: {
    // container: '#editorToolbar',
    options: [
      ['undo', 'redo'],
      ['all', 'clean'],
      [
        { bold: 'normal' },
        { italic: 'normal' },
        { strike: 'normal' },
        { underline: 'normal' },
        { underline: 'wavy' },
        { dotted: 'circle' },
        { script: 'super' },
        { script: 'sub' },
      ],
      [
        { align: 'left' },
        { align: 'center' },
        { align: 'right' },
        { indent: 'normal' },
      ],
      ['image', 'fillBlankUnderline', 'fill-blank-brackets'],
      ['pi', 'latexToSvg', 'svgToLatex'],
      [{ pinyin: [] }],
      [{ list: 'ordered' }],
      [{ size: ['12px', '14px', '16px'] }],
    ],
  },
  events: {
    openFormula,
    insertBlankOption,
    getFormat,
  },
});

function openFormula(latex = '') {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  showFormula(true);
  const formula = formulaContainer.querySelector('#formulaEditor');
  formula.contentWindow.latexEditor.set(latex);
}

function insertBlankOption(index) {

}

function getFormat(format) {
  console.log(format);
}

function showFormula(boolean) {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  formulaContainer.style.visibility = boolean ? 'visible' : 'hidden';
}

const table = editor.quill.getModule('table');
window.editor = editor;

function query(selector) {
  return document.querySelector(selector);
}
// query('#insertTable').addEventListener('click', () => table.insertTable(Number(rowNumber.value), Number(columnNumber.value)));
// query('#insertRowAbove').addEventListener('click', () => table.insertRowAbove());
// query('#insertRowBelow').addEventListener('click', () => table.insertRowBelow());
// query('#insertColumnLeft').addEventListener('click', () => table.insertColumnLeft());
// query('#insertColumnRight').addEventListener('click', () => table.insertColumnRight());

document.querySelector('#formulaEditorClose').addEventListener('click', () => {
  showFormula(false);
});

['bold', 'italic', 'strike', 'underline'].forEach(item => {
  const button = document.createElement('button');
  button.innerHTML = item;
  button.addEventListener('click', () => {
    editor.format(item, 'normal');
  });
  document.body.appendChild(button);
});

let lastEditedBox = null;
document.body.addEventListener('click', e => {
  let node = e.target;
  while (node !== document.body) {
    if (node.classList.contains('edited-box')) {
      if (lastEditedBox !== node) {
        if (lastEditedBox != null) {
          lastEditedBox.innerHTML = editor.getContent();
        }
        lastEditedBox = node;
        editor.setContent(node.innerHTML.trim());
        document.querySelector('#editor').style.display = 'block';
        return;
      }
      break;
    } else {
      node = node.parentNode;
    }
  }
  // editor.hide();
});
