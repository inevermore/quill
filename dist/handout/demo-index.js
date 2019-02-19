import Editor from '../index';

const box = document.querySelector('#editor');
const editor = new Editor({
  container: '#editor',
  theme: 'handout',
  events: {
    openFormula,
    getFormat,
  },
  options: [
    {
      font: ['sans-serif', 'Arial'],
    },
    {
      bold: ['normal'],
    },
    {
      italic: ['normal'],
    },
    {
      dotted: ['normal'],
    },
    {
      strike: ['normal'],
    },
    'color',
    'background',
    {
      script: ['super', 'sub'],
    },
    {
      list: ['ordered'],
    },
    {
      align: ['left', 'center', 'right'],
    },
    {
      indent: ['normal'],
    },
    {
      underline: ['normal'],
    },
  ],
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

[{font: 'Arial'},{bold: 'normal'}, {italic: 'normal'}, {dotted: 'normal'},{strike: 'normal'}, {script: 'sub'}, 
 {color: 'red'}, {background: 'gray'}, {align: 'center'}, {indent: 'normal'}, {list: 'ordered'}].forEach(item => {
  Object.entries(item).forEach(([key, val]) => {
    const button = document.createElement('button');
    button.innerHTML = `${key}: ${val}`;
    button.addEventListener('click', () => {
      editor.format(key, val);
    });
    document.body.appendChild(button);
  });
});
const button = document.createElement('button');
button.innerHTML = 'split';
button.addEventListener('click', () => {
  console.log(editor.splitContent());
});
document.body.appendChild(button);

let lastEditedBox = null;
document.body.addEventListener('click', e => {
  let node = e.target;
  while (node !== document.body) {
    if (node.classList.contains('edited-box')) {
      if (lastEditedBox !== node) {
        if (lastEditedBox != null) {
          lastEditedBox.innerHTML = editor.getContent();
          lastEditedBox.appendChild(box);
        }
        lastEditedBox = node;
        editor.setContent(node.innerHTML.trim());
        node.innerHTML = '';
        box.style.display = 'block';
        lastEditedBox.appendChild(box);
        return;
      }
      break;
    } else {
      node = node.parentNode;
    }
  }
  // editor.hide();
});
