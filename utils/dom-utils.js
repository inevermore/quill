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
