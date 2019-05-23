import Editor from '../../index';

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
const str = '<div class="text-editor-wrapper"><p>1<span class="fill-blank" title="移除填空" data-index="1" id="0" style="font-style: normal;">﻿<span contenteditable="false" class="blank-list-remove">1</span>﻿</span><span class="fill-blank" title="移除填空" data-index="2" id="1" style="font-style: normal;">﻿<span contenteditable="false" class="blank-list-remove">2</span>﻿</span><span class="fill-blank" title="移除填空" data-index="3" id="2" style="font-style: normal;">﻿<span contenteditable="false" class="blank-list-remove">3</span>﻿</span><span class="fill-blank" title="移除填空" data-index="4" id="3" style="font-style: normal;">﻿<span contenteditable="false" class="blank-list-remove">4</span>﻿</span></p></div>'

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
// editor.setContent(str)

function blankOrderChange(type, list, len) {
  if (type === 'add') {
    blankList.splice(list[0] - 1, 0, ...list);
  } else {
    blankList.splice(list[0] - 1, list.length);
  }
  console.log(list,len)
}

const editor1 = new Editor({
  container: '#tikuEditor1',
  theme: 'tiku',
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
  }
});
editor1.setContent(str)

function getFormat(format) {
}

const button = document.createElement('button');
button.innerText = 'setContent'
button.addEventListener('click', () => {
  editor.setContent(editor.getContent());
});
document.body.appendChild(button);

window.editor = editor;
