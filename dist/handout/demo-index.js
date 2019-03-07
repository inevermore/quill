import Editor from '../../index';

const box = document.querySelector('#editor');
const editor = new Editor({
  container: '#editor',
  theme: 'handout',
  toolbar: {
    container: 'default',
  },
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
    // {
    //   indent: [-1 ,+1],
    // },
    // {
    //   underline: ['normal'],
    // },
    {indent: [1,2,3,4,5,6,7,8]},
    {'text-indent': 'normal'}
  ],
});

function openFormula(latex = '') {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  showFormula(true);
  const formula = formulaContainer.querySelector('#formulaEditor');
  formula.contentWindow.latexEditor.set(latex);
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
const button1 = document.createElement('button');
button1.innerHTML = 'split';
button1.addEventListener('click', () => {
  console.log(editor.splitContent());
});
document.body.appendChild(button1);
var button2 = document.createElement('button');
button2.innerHTML = 'indent';
button2.addEventListener('click', () => {
  editor.format('indent', '+1');
});
document.body.appendChild(button2);

var button2 = document.createElement('button');
button2.innerHTML = 'cancel list';
button2.addEventListener('click', () => {
  editor.format('list', false);
});
document.body.appendChild(button2);


let lastEditedBox = null;
document.body.addEventListener('click', e => {
  let node = e.target;
  while (node !== document.body) {
    if (node.classList.contains('edited-box')) {
      if (lastEditedBox !== node) {
        if (lastEditedBox != null) {
          lastEditedBox.innerHTML = editor.getContent();
          lastEditedBox.appendChild(box);
          setTimeout(() => {
            editor.quill.setSelection(0, 0);
          }, 0)
        }
        lastEditedBox = node;
        editor.setContent(node.innerHTML.trim());
        node.innerHTML = '';
        box.style.display = 'block';
        lastEditedBox.appendChild(box);
        setTimeout(() => {
          editor.quill.setSelection(0, 0);
        }, 0)
        return;
      }
      break;
    } else {
      node = node.parentNode;
    }
  }
  // editor.hide();
});