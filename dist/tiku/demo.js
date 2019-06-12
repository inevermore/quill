import Editor from '../../index';

const options = [
  ['undo', 'redo'],
  [
    { bold: 'normal' },
    { italic: 'normal' },
    { strike: 'normal' },
    { align: 'center' },
    { align: 'left' },
    { align: 'right' },
    { 'text-indent': 'normal' },
    { script: 'super' },
    { script: 'sub' },
  ],
  ['select-all', 'clear'],
  ['image'],
  [
    'fill-blank-order',
    { dotted: 'normal' },
    'fill-blank-underline',
    { underline: 'normal' },
    { underline: 'wavy' },
    'fill-blank-brackets',
    'formula-editor',
    'latex2svg',
    'svg2latex',
    'pinyin',
    'table-insert',
  ],
];
const blankList = [];
const str = '<div class="text-editor-wrapper"><p>如图所示，用量角器度量$\\angle 1$，可以读出$\\angle 1$的度数为<span class="yikespec-bracket" contenteditable="false" onselectstart="return false">（&nbsp;&nbsp;&nbsp;）</span>．</p><p>&nbsp;</p><p><img src="https://img.zuoyebang.cc/zyb_db8fd03e2124d922e09cb673863e78d9.jpg" title="https://img.zuoyebang.cc/zyb_db8fd03e2124d922e09cb673863e78d9.jpg.jpg"></p></div>'
// const str = '<div class="text-editor-wrapper"><p>  1234   </p><table align="center"><tbody><tr><td data-row="row-cib7" class="tkspec-table-diagonal-normal"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td></tr></tbody></table>1234</div>'

const editor = new Editor({
  container: '#tikuEditor',
  theme: 'tiku',
  toolbar: {
    handlers: {
      'fill-blank-order': function() {
        const savedIndex = this.quill.selection.savedRange.index;
        this.quill.insertEmbed(savedIndex, 'fill-blank-order', '1');
        this.quill.setSelection(savedIndex + 1, 0);
      }
    }
  },
  events: {
    getFormat,
    blankOrderChange,
  },
  options,
  uploader: {
    param: 'upfile',
    url: 'http://test152.suanshubang.com/zbtiku/tiku/imgupload?action=uploadimage',
    method: 'post',
    maxSize: 600,
    response: ['url'],
  },
});
editor.setContent(str)

function blankOrderChange(type, list, len) {
  if (type === 'add') {
    blankList.splice(list[0] - 1, 0, ...list);
  } else {
    blankList.splice(list[0] - 1, list.length);
  }
  console.log(list,len)
}

// const editor1 = new Editor({
//   container: '#tikuEditor1',
//   theme: 'tiku',
//   events: {
//     getFormat,
//     blankOrderChange,
//   },
//   options,
//   uploader: {
//     param: 'upfile',
//     url: 'http://test152.suanshubang.com/zbtiku/tiku/imgupload?action=uploadimage',
//     method: 'post',
//     maxSize: 600,
//     response: ['url'],
//   }
// });

function getFormat(format) {
  console.log(console.log(format));
}

const button = document.createElement('button');
button.innerText = 'setContent';
button.addEventListener('click', () => {
  editor.setContent(editor.getContent());
});
document.body.appendChild(button);

const table1 = editor.quill.getModule('table');
const button1 = document.createElement('button');
button1.innerText = 'insert table diagonal';
button1.addEventListener('click', () => {
  editor.format('table-diagonal', 'normal')
});
document.body.appendChild(button1);

window.editor = editor;
