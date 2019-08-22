// check if node is contained by some element which class == className
// root is top container
export function isContainByClass(node, className, root = document.body) {
  while (root.contains(node)) {
    if (node.classList.contains(className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export function isContainByTable(node, root = document.body) {
  while (root.contains(node)) {
    if (node.tagName.toUpperCase() === 'TABLE') {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function getTdParent(node) {
  while (node.nodeType !== node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  while (node.tagName.toUpperCase() !== 'TD') {
    if (node.tagName.toUpperCase() === 'BODY') {
      return null;
    }
    node = node.parentNode;
  }
  return node;
}

// 遍历选区dom
export function iterateNodes(range, selector) {
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
    const { tagName, classList } = iterator.referenceNode;
    if (
      (selector.startsWith('.') && classList.contains(selector.slice(1))) ||
      (tagName && tagName.toUpperCase() === selector.toUpperCase())
    ) {
      nodes.push(iterator.referenceNode);
    }
    if (iterator.referenceNode === end.node) break;
  }
  return nodes;
}
