import Editor from '../../index';
const options = [
  ['undo', 'redo'],
  [
    { italic: 'normal' },
    { strike: 'normal' },
    { align: 'center' },
    { align: 'left' },
    { align: 'right' },
    { 'text-indent': 'normal' },
    { script: 'super' },
    { script: 'sub' },
  ],
  ['select-all', 'clear'],
  ['image'],
  [
    'fill-blank-order',
    { dotted: 'normal' },
    'fill-blank-underline',
    { underline: 'normal' },
    { underline: 'wavy' },
    'fill-blank-brackets',
    'formula-editor',
    'svg2latex',
    'latex2svg',
    'pinyin'
  ],
];

const editor = new Editor({
  container: '#tikuEditor',
  theme: 'tiku',
  events: {
    openFormula,
    getFormat,
  },
  options,
  uploader: {
    param: 'upfile',
    url: 'http://test152.suanshubang.com/zbtiku/tiku/imgupload?action=uploadimage',
    method: 'post',
    maxSize: 600,
    response: ['url'],
  }
});

function openFormula(latex = '') {
  let formulaContainer = document.querySelector('#formulaEditorContainer');
  if (!formulaContainer) {
    formulaContainer = createFormulaContainer();
    document.body.appendChild(formulaContainer);
  }

  showFormula(true);
  const formula = formulaContainer.querySelector('#formulaEditor');
  // formula.contentWindow.latexEditor.set(latex);
}

function getFormat(format) {
}

function showFormula(boolean) {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  formulaContainer.style.visibility = boolean ? 'visible' : 'hidden';
}

window.editor = editor;

`<div class="formula-dialog" id="formulaEditorContainer">
<div class="formula-editor-container">
  <header>
    <span>作业帮新理科公式编辑器</span>
    <b id="formulaEditorClose"></b>
  </header>
  <iframe id="formulaEditor" src="//mis.zuoyebang.cc/static/equation-editor/index.html width=" 100%"="" height="480px" frameborder="0" "=""></iframe>
</div>
</div>`
function createFormulaContainer() {
  const dialog = document.createElement('div');
  dialog.id = 'formulaEditorContainer';
  dialog.classList.add('formula-dialog');

  const container = document.createElement('div');
  container.classList.add('formula-editor-container');
  const iframe = document.createElement('iframe');
  iframe.id = 'formulaEditor';
  iframe.src = '//mis.zuoyebang.cc/static/equation-editor/index.html';
  iframe.width = '100%';
  iframe.height = '100%';
  const header = createHeader();
  header.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', e => {
      console.log(e);
    });
    document.addEventListener('mouseup' e => {

    })
  })

  container.appendChild(header);
  container.appendChild(iframe);

  dialog.appendChild(container);
  return dialog;
}

function createHeader() {
  const header = document.createElement('header');
  const title = document.createElement('span');
  title.innerText = '作业帮新理科公式编辑器';
  const closeIcon = document.createElement('b');
  closeIcon.id = 'formulaEditorClose';
  closeIcon.addEventListener('click', () => {
    showFormula(false);
  });
  header.appendChild(title);
  header.appendChild(closeIcon);
  return header;
}
