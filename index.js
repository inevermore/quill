window.quill = new Quill('#editor', {
  theme: 'tiku',
  modules: {
    // toolbar: [['bold', 'italic', 'strike'], ['link', 'image'], ['table']],
    table: true,
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  },
});

const table = window.quill.getModule('table');

function query(selector) {
  return document.querySelector(selector);
}
query('#insertTable').addEventListener('click', () => table.insertTable(Number(rowNumber.value), Number(columnNumber.value)));
query('#insertRowAbove').addEventListener('click', () => table.insertRowAbove());
query('#insertRowBelow').addEventListener('click', () => table.insertRowBelow());
query('#insertColumnLeft').addEventListener('click', () => table.insertColumnLeft());
query('#insertColumnRight').addEventListener('click', () => table.insertColumnRight());

function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: false,
    writable: true,
    configurable: true,
  });
}

window.obs = function observeArray(arr, event) {
  const methods = ['push', 'pop', 'shift', 'unshift'];
  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);
  methods.forEach(method => {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, (...args) => {
      const result = original.apply(arr, args);
      console.log('observe array');
      return result;
    });
    arr.__proto__ = arrayMethods; // eslint-disable-line no-proto
  });
}
window.a = []
