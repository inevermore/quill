export default function svgToLatex(quill) {
  // 点击按钮执行的逻辑
  // 如果有选中的range，只处理range；否则全部处理
  const [range, native] = quill.selection.getRange();
  if (range && range.length > 0) {
    let nodeCount = 0;
    let latexCount = 0;
    iterateNodes(native, domNode => {
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

// 遍历选区dom
function iterateNodes(range, fn) {
  const { start, end, native } = range;
  const iterator = document.createNodeIterator(
    native.commonAncestorContainer,
    NodeFilter.SHOW_ALL, // pre-filter
  );

  let flag = false;
  // 将svg节点缓存统一处理，不要每次遍历都处理，以避免 iterator 遍历 bug
  const nodes = [];
  while (iterator.nextNode()) {
    if (!flag && iterator.referenceNode !== start.node) {
      // eslint-disable-next-line no-continue
      continue;
    }
    flag = true;
    const { tagName } = iterator.referenceNode;
    if (tagName && tagName.toUpperCase() === 'SVG') {
      const qlMathjaxNode = iterator.referenceNode.parentNode.parentNode;
      nodes.push(qlMathjaxNode);
    }
    if (iterator.referenceNode === end.node) break;
  }
  nodes.forEach(fn);
}
