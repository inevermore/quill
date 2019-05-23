import { mathjaxRender } from './latex-to-svg';

let insertFormula = () => {};
let isLoaded = false;

function openFormula(latex = '', fn) {
  insertFormula = fn;
  let formulaContainer = document.querySelector('#formulaEditorContainer');
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
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  formulaContainer.style.visibility = boolean ? 'visible' : 'hidden';
}

function setFormulaValue(latex) {
  const container = document.querySelector('#formulaEditorContainer');
  const iframe = container.querySelector('iframe');
  iframe.contentWindow.postMessage(
    {
      type: 'getEquationInfo',
      data: latex,
    },
    '*',
  );
}

window.addEventListener(
  'message',
  async ({ data }) => {
    if (data.type === 'sendEquationInfo') {
      const latex = data.data;
      if (latex === '$$') return;
      const svg = await mathjaxRender([latex]);
      showFormula(false);
      try {
        insertFormula({
          latex: latex.slice(1, -1),
          svg: svg[0].outerHTML,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('insert formula', err);
      }
    }
  },
  false,
);

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
  iframe.src = '//jymis.zuoyebang.cc/static/equation-editor/index.html';
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
