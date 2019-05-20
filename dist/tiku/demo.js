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
    'svg2latex',
    'latex2svg',
    'pinyin'
  ],
];
const blankList = [];

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

editor.quill.on(Editor.events.EDITOR_CHANGE, (type, range) => {
  if (type === Editor.events.TEXT_CHANGE) {
    console.log('text-change')
  }
});

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
function getFormat(format) {
}

window.editor = editor;
