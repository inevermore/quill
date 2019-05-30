import Editor from '../../index';
import latexToSvg from '../../utils/latex-to-svg';

const options = [
  ['undo', 'redo'],
  [
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
    'pinyin'
  ],
];
const blankList = [];
const str = '<div class="text-editor-wrapper"><p><span class="fill-blank" title="移除填空" style="font-style: normal;" data-index="1" id="0">﻿<span contenteditable="false" class="blank-list-remove">1</span>﻿</span>jo<span class="fill-blank" title="移除填空" style="font-style: normal;" data-index="2" id="1">﻿<span contenteditable="false" class="blank-list-remove">2</span>﻿</span></p> <p><span class="fill-blank" title="移除填空" style="font-style: normal;" data-index="1" id="0">﻿<span contenteditable="false" class="blank-list-remove">1</span>﻿</span>jo<span class="fill-blank" title="移除填空" style="font-style: normal;" data-index="2" id="1">﻿<span contenteditable="false" class="blank-list-remove">2</span>﻿</span></p></div>'

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

const table = editor.quill.getModule('table');
const button = document.createElement('button');
button.innerText = 'insert table';
button.addEventListener('click', () => {
  table.insertTable(5,5)
});
document.body.appendChild(button);

window.editor = editor;

function getPer(str) {
  if (str === '') {
    return;
  }
  const arr = str.split('');
  permution(arr, 0)
}
let count = 0;
function permution(arr, begin) {
  if (begin === arr.length) {
    // console.log(arr);
  } else {
    for (let i = begin; i < arr.length; i++) {
      console.log(++count);
      [arr[i], arr[begin]] = [arr[begin], arr[i]];
      permution(arr, begin+1);
      [arr[begin], arr[i]] = [arr[i], arr[begin]];
    }
  }
}
getPer('abc');

function loop(arr, start) {
  const walked = new Array(arr.length * arr[0].length).fill(false);
  walk(arr, walked, start);
}
function walk(arr, walked, pos) {
  const [x, y] = pos;
  const m = arr[0].length;
  const n = arr.length;
  if (walked[y*m + x]) {
    return;
  }
  console.log(arr[y][x]); 
 
  walked[y * m + x] = true;
  if (y > 0) {
    walk(arr, walked, [x, y-1]);
  }
  if (x < m - 1) {
    walk(arr, walked, [x+1, y]);
  }
  if (y < n - 1) {
    walk(arr, walked, [x, y + 1])
  }
  if (x > 0) {
    walk(arr, walked, [x - 1, y])
  }
}
// loop([
//   [1, 2,  3,  4],
//   [5, 6,  7,  8],
//   [9, 10, 11, 12],
//   ['a', 'b', 'c', 'd']
// ], [1,1])
