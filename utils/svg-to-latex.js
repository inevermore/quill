import { iterateNodes } from './dom-utils';

export default function svgToLatex(quill) {
  // 点击按钮执行的逻辑
  // 如果有选中的range，只处理range；否则全部处理
  const [range, native] = quill.selection.getRange();
  if (range && range.length > 0) {
    let nodeCount = 0;
    let latexCount = 0;
    iterateNodes(native, 'svg').forEach(node => {
      const domNode = node.parentNode.parentNode;
      const latex = `$${getSvgLatex(domNode)}$`;
      latexCount += latex.length;
      domNode.outerHTML = latex;
      nodeCount += 1;
    });
    // 异步setSelection，在mutationObersever后设置
    Promise.resolve().then(() => {
      quill.setSelection(
        range.index,
        range.length - nodeCount + latexCount,
        'user',
      );
    });
  } else {
    const imgs = quill.root.querySelectorAll(`.${quill.formulaImgClass}`);
    Array.from(imgs).forEach(img => {
      img.outerHTML = `$${getSvgLatex(img)}$`;
    });
  }
}

export function getSvgLatex(node) {
  return node.getAttribute('latex').replace(/[><]/g, item => {
    switch (item) {
      case '>':
        return '&gt;';

      case '<':
        return '&lt;';

      default:
        return '';
    }
  });
}
