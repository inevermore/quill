import Editor from '../../index';
const Quill = Editor.Quill;

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
  [{ list: 'ordered' }]
];
const blankList = [];
// const str = `<div class="text-editor-wrapper"><p><span class="fill-blank" title="移除填空" data-index="1" id="0" style="font-style: normal;">&#65279;<span contenteditable="false" class="blank-list-remove">1</span>&#65279;</span>&#8203;</p><p>如图所示，用量角器度量$\\angle 1$，可以读出$\\angle 1$的度数为<span class="tkspec-embed-text tkspec-fill-blank-brackets">&#65279;<span contenteditable="false">（   ）</span>&#65279;</span>．</p><p>123</p><table><tbody><tr><td data-row="row-jml4" class="tkspec-table-diagonal-normal">         a
// wef</td><td data-row="row-jml4"><span class="paragraph-mark"></span></td><td data-row="row-jml4"><span class="paragraph-mark"></span></td><td data-row="row-jml4"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-6ha3"><span class="paragraph-mark"></span></td><td data-row="row-6ha3"><span class="paragraph-mark"></span></td><td data-row="row-6ha3"><span class="paragraph-mark"></span></td><td data-row="row-6ha3"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-mp62"><span class="paragraph-mark"></span></td><td data-row="row-mp62"><span class="paragraph-mark"></span></td><td data-row="row-mp62"><span class="paragraph-mark"></span></td><td data-row="row-mp62"><span class="paragraph-mark"></span></td></tr></tbody></table><p><span class="paragraph-mark"></span></p><p>&nbsp;</p><p><img src="https://img.zuoyebang.cc/zyb_db8fd03e2124d922e09cb673863e78d9.jpg" width="null" height="null"></p></div>`
// const str = '<div class="text-editor-wrapper"><p>  1234   </p><table align="center"><tbody><tr><td data-row="row-cib7" class="tkspec-table-diagonal-normal"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td><td data-row="row-cib7"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td><td data-row="row-41oi"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td><td data-row="row-0nql"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td><td data-row="row-jjgf"><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td><td data-row="row-d7sy"><span class="paragraph-mark"></span></td></tr></tbody></table>1234</div>'
// const str = '<div class="text-editor-wrapper"><p style="position: relative;">12312123</p><p style="position: relative;">awefawe</p><p style="position: relative;">fawef awefawef awef awef </p><p style="position: relative;">awefa</p><p style="position: relative;">wefaw<img src="https://img.zuoyebang.cc/fudao_74794393022768f95db2400fcbdacab7.png" key="pic1560499632471-0" style="position: absolute; z-index: 99; top: 0.5px; left: 20px; width: 349px; height: 158.266px;"></p><p style="position: relative;">fe</p><p style="position: relative;">awef awef awef awef</p><p style="position: relative;">awef</p></div>'
// const str = `<div class="text-editor-wrapper"><table align="center" data-sort="sortDisabled"><tbody><tr class="firstRow"><td data-row="1" rowspan="1" colspan="2" class="tkspec-table-diagonal-normal">123 1231 awefawef
// 物质（括号内为杂质）</td><td width="190" valign="top" style="word-break: break-all;">
// 所              用             试剂</td><td width="339" valign="top" style="word-break: break-all;">       主要实验操作         </td></tr><tr><td width="40" valign="top" style="word-break: break-all;">A</td><td width="396" valign="top" style="word-break: break-all;"><img class="kfformula" src="https://img.zuoyebang.cc/zyb_7219d6f220a4760be35bcc70883bb89b.jpg" style="width: 48px;">（<img class="kfformula" src="https://img.zuoyebang.cc/zyb_61425b655907665dd0f4de8a23d26623.jpg" style="width: 35px;">）</td><td width="190" valign="top"><img class="kfformula" src="http://img.zuoyebang.cc/zyb_6e94a2b3acab85f3ff9035a593d3d490.jpg" style="width: 36px;"></td><td width="339" valign="top" style="word-break: break-all;">溶解、过滤</td></tr><tr><td width="40" valign="top" style="word-break: break-all;">B</td><td width="396" valign="top" style="word-break: break-all;"><img class="kfformula" src="https://img.zuoyebang.cc/zyb_4b765e2ea020b061921f2510b6b91bb6.jpg" style="width: 43.5px;">（<img class="kfformula" src="https://img.zuoyebang.cc/zyb_56df8b9a847829415bbc19892e795318.jpg" style="width: 58.5px;">）</td><td width="190" valign="top"><img class="kfformula" src="http://img.zuoyebang.cc/zyb_96d904a4ad344d89604a6a594422ead9.jpg" style="width: 53px;"></td><td width="339" valign="top" style="word-break: break-all;">溶解、过滤、蒸发</td></tr><tr><td width="40" valign="top" style="word-break: break-all;">C</td><td width="396" valign="top" style="word-break: break-all;"><img class="kfformula" src="https://img.zuoyebang.cc/zyb_5b51776f7dfdefed28ac9427670291d6.jpg" style="width: 32px;">（<img class="kfformula" src="https://img.zuoyebang.cc/zyb_3816a2c1ad886f0b0a1424364c3b2e77.jpg" style="width: 27.5px;">）</td><td width="190" valign="top"><img class="kfformula" src="http://img.zuoyebang.cc/zyb_3493d76b38946c816e2d2631403dd688.jpg" style="width: 21px;"></td><td width="339" valign="top" style="word-break: break-all;">点燃</td></tr><tr><td width="40" valign="top" style="word-break: break-all;">D</td><td width="396" valign="top" style="word-break: break-all;"><img class="kfformula" src="https://img.zuoyebang.cc/zyb_95168275750c769512db76aaacf0da81.jpg" style="width: 39px;">（<img class="kfformula" src="http://img.zuoyebang.cc/zyb_6e94a2b3acab85f3ff9035a593d3d490.jpg" style="width: 36px;">）</td><td width="190" valign="top" style="word-break: break-all;">浓<img class="kfformula" src="https://img.zuoyebang.cc/zyb_29eb6cfcd5e6f50e3a3503818bc3d97f.jpg" style="width: 54px;"></td><td width="339" valign="top" style="word-break: break-all;">洗气</td></tr></tbody></table></div>`
// const str = `<div class="text-editor-wrapper"><p class="yikespec-text-indent" style="text-indent: 1.5em; text-align: left;">①我曾说</p></div>`
// const str = `<div class="text-editor-wrapper"><p class="yikespec-text-indent">①我曾说</p></div>`
// const str = `<div class="text-editor-wrapper"><img width="50px" class="kfformula" src="https://img.zuoyebang.cc/zyb_a4f574e79e82d6524597995dc9cf0e3e.jpg" style="width: 55px;"></div>`
// const str = `<div class="text-editor-wrapper"><table table-align="center"><tbody><tr><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr></tbody></table><p><span class="paragraph-mark"></span></p></div>`
const str = `<div class="text-editor-wrapper"><table table-align="center"><tbody><tr><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-lcvg" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-q191" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr><tr><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="row-vxa9" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td></tr></tbody></table><p><span class="paragraph-mark"></span></p></div>`
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
// Quill.register('formats/list', List);
// let List = Quill.import('formats/list');
// class ListStyle extends List {
//   static create (value) {
//     console.log('value')
//     let node = super.create();
//     node.className = 'ql-list-' + value;
//     return node;
//   }
//   // 重写formats方法，验证
//   static formats (domNode) {
//     return domNode.className.substring(8);
//   }
// }
// Quill.register(ListStyle);
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
  console.log('beore root.innerHTML', editor.quill.root.innerHTML)
  editor.quill.latex2svg(true);
  console.log('root.innerHTML', editor.quill.root.innerHTML)
  const html = editor.getContent(true);
  console.log('html', html)
  const div = document.createElement('div');
  div.innerHTML = html;
  const container = div.children[0];
  const result = div.children[0].innerHTML;
  if (result === '<p><span class="paragraph-mark"></span></p>') {
    return '';
  }
  console.log(editor.getContent())
});
document.body.appendChild(button1);

window.editor = editor;
