window.quill = new Quill('#editor', {
  theme: 'tiku',
  modules: {
    // toolbar: [['bold', 'italic', 'strike'], ['link', 'image'], ['table']],
    table: true,
  },
});
const table = quill.getModule('table');

function query(selector) {
  return document.querySelector(selector);
}
query('#insertTable').addEventListener('click', () => table.insertTable(2, 2));
query('#insertRow').addEventListener('click', () => table.insertRowAbove());
query('#insertColumnLeft').addEventListener('click', () => table.insertColumnLeft());
query('#insertColumnRight').addEventListener('click', () => table.insertColumnRight());
