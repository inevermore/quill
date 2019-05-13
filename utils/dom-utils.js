// check if node is contained by some element which class == className
// root is top container
function isContain(node, root, className) {
  while (root.contains(node)) {
    if (node.classList.contains(className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

// eslint-disable-next-line import/prefer-default-export
export { isContain };
