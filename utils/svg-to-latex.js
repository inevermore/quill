export default function svgToLatex(quill) {
  // 点击按钮执行的逻辑
  // 1. 如果有选中的range，只处理range
  const [range] = quill.selection.getRange();
  if (range && range.length > 0) {
    // let nodeCount = 0;
    // let latexCount = 0;
    const { native } = quill.selection.getNativeRange();
    iterateNodes(native, domNode => {
      if (
        domNode.nodeType === Node.ELEMENT_NODE &&
        domNode.classList.contains(quill.formulaImgClass)
      ) {
        const latex = `$${getSvgLatex(domNode)}$`;
        // latexCount += latex.length;
        domNode.outerHTML = latex;
        // nodeCount += 1;
      }
    });
    // TODO: setSelection 未生效
    // quill.setSelection(range.index, range.length - nodeCount + latexCount);
  } else {
    const imgs = quill.root.querySelectorAll(`.${quill.formulaImgClass}`);
    Array.from(imgs).forEach(img => {
      img.outerHTML = `$${getSvgLatex(img)}$`;
    });
  }
}

export function getSvgLatex(node) {
  return node.getAttribute('latex').replace(/[><]g/, item => {
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

// 遍历选区dom
function iterateNodes(range, fn) {
  const iterator = document.createNodeIterator(
    range.commonAncestorContainer,
    NodeFilter.SHOW_ALL, // pre-filter
    {
      // custom filter
      acceptNode() {
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  let flag = false;
  while (iterator.nextNode()) {
    if (!flag && iterator.referenceNode !== range.startContainer) {
      // eslint-disable-next-line no-continue
      continue;
    }
    flag = true;
    fn(iterator.referenceNode);
    if (iterator.referenceNode === range.endContainer) break;
  }
}
