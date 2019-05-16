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

const editor = new Editor({
  container: '#tikuEditor',
  theme: 'tiku',
  events: {
    getFormat,
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

const editor1 = new Editor({
  container: '#tikuEditor1',
  theme: 'tiku',
  events: {
    getFormat,
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
