import { mathjaxRender } from './latex-to-svg';
import PlatformTheme from '../themes/platform';

const OFFSET_LEFT = 320;

let isLoaded = false;
let quill = {};
let formulaContainer = null;

function openFormula(latex = '', quillObj) {
  quill = quillObj;
  formulaContainer = document.querySelector('#formulaEditorContainer');
  if (!formulaContainer) {
    formulaContainer = createFormulaContainer();
    document.body.appendChild(formulaContainer);
    const container = formulaContainer.querySelector(
      '.formula-editor-container',
    );
    container.style.left = `${(window.innerWidth - container.offsetWidth) /
      2}px`;
    container.style.top = `${(window.innerHeight - container.offsetHeight) /
      2}px`;
    listenMessage();
  }

  showFormula(true);
  if (isLoaded) {
    setFormulaValue(latex);
  } else {
    const iframe = formulaContainer.querySelector('iframe');
    iframe.onload = function() {
      isLoaded = true;
      setFormulaValue(latex);
    };
  }
}

function showFormula(boolean) {
  formulaContainer.style.visibility = boolean ? 'visible' : 'hidden';
  if (!boolean) {
    const { index } = quill.selection.savedRange;
    quill.focus();
    quill.setSelection(index + 1, 0, 'user');
  } else {
    initPosition(formulaContainer);
  }
}

function initPosition() {
  const editorBox = formulaContainer.children[0];
  const left = window.innerWidth / 2 - editorBox.offsetWidth / 2;
  const top = window.innerHeight / 2 - editorBox.offsetHeight / 2;
  editorBox.style.left = `${Math.max(left + OFFSET_LEFT, 0)}px`;
  editorBox.style.top = `${Math.max(top, 0)}px`;
}

function setFormulaValue(latex) {
  const iframe = formulaContainer.querySelector('iframe');
  iframe.contentWindow.postMessage(
    {
      type: 'getEquationInfo',
      data: latex.replace(/&amp;/g, '&'),
    },
    '*',
  );
}

function listenMessage() {
  window.addEventListener(
    'message',
    async ({ data }) => {
      if (data.type === 'sendEquationInfo') {
        const latex = data.data;
        if (latex === '$$') return;
        const obj = await mathjaxRender([latex]);
        try {
          quill.insertFormula(obj[0]);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('insert formula', err);
        }
        showFormula(false);
      }
    },
    false,
  );
}

function createFormulaContainer() {
  const dialog = document.createElement('div');
  dialog.id = 'formulaEditorContainer';
  dialog.classList.add('formula-dialog');

  const container = document.createElement('div');
  container.classList.add('formula-editor-container');
  const box = document.createElement('div');
  box.classList.add('iframe-box');
  const mask = document.createElement('div');
  mask.classList.add('iframe-mask');
  box.appendChild(mask);

  const iframe = document.createElement('iframe');
  iframe.id = 'formulaEditor';
  const params = [];
  if (quill.subject !== undefined) {
    params.push(`course=${quill.subject}`);
  }
  if (quill.theme instanceof PlatformTheme) {
    params.push('from=platform');
  }
  let src = '//jymis.zuoyebang.cc/static/equation-editor/index.html';
  if (params.length) {
    src += `?${params.join('&')}`;
  }
  iframe.src = src;
  iframe.width = '100%';
  iframe.height = '485px';
  box.appendChild(iframe);
  const header = createHeader();
  header.addEventListener('mousedown', ev => {
    const rect = container.getBoundingClientRect();
    mask.style.visibility = 'visible';
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    function mouseMove(e) {
      const left = rect.left + e.clientX - ev.clientX;
      const top = rect.top + e.clientY - ev.clientY;
      container.style.left = `${Math.max(left, 0)}px`;
      container.style.top = `${Math.max(top, 0)}px`;
      e.stopPropagation();
    }
    function mouseUp() {
      mask.style.visibility = 'hidden';
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    }
  });
  container.appendChild(header);
  container.appendChild(box);
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

export default openFormula;
