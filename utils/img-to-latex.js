function imgToLatex(quill) {
  // 点击按钮执行的逻辑
  // 1. 如果有选中的range，只处理range
  const [range] = quill.selection.getRange();
  if (range && range.length > 0) {
    let nodeCount = 0;
    let latexCount = 0;
    quill.traversingSelected(blot => {
      const { domNode } = blot;
      if (
        domNode.nodeType === Node.ELEMENT_NODE &&
        domNode.classList.contains('yk-math-img')
      ) {
        const latex = `$${getImgLatex(domNode)}$`;
        latexCount += latex.length;
        domNode.outerHTML = latex;
        nodeCount += 1;
      }
    });
    // TODO: setSelection 未生效
    // quill.setSelection(range.index, range.length - nodeCount + latexCount);
  } else {
    const imgs = quill.root.querySelectorAll('.yk-math-img');
    Array.from(imgs).forEach(img => {
      img.outerHTML = `$${getImgLatex(img)}$`;
    });
  }
}

function getImgLatex(node) {
  return node.dataset.latex.replace(/[><]g/, item => {
    switch (item) {
      case '<':
        return '&gt;';

      case '>':
        return '&lt;';

      default:
        return '';
    }
  });
}

export default imgToLatex;
