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
// const str = `<div class="text-editor-wrapper"><table table-align=""><tbody><tr><td data-row="1" rowspan="1" colspan="1" tbalign="">     亲本序号
//  1234</td><td class="tkspec-align-left" data-row="1" rowspan="1" colspan="1" tbalign="">$1$</td><td data-row="1" rowspan="1" colspan="1" tbalign="">$2$</td><td data-row="1" rowspan="1" colspan="1" tbalign="">$3$</td><td data-row="1" rowspan="1" colspan="1" tbalign="">$4$</td><td data-row="1" rowspan="1" colspan="1" tbalign="">$5$</td></tr><tr><td data-row="2" rowspan="1" colspan="1" tbalign="">染色体</td><td data-row="2" rowspan="1" colspan="1" tbalign=""><span class="paragraph-mark"></span></td><td data-row="2" rowspan="1" colspan="1" tbalign="">第Ⅱ染色体</td><td data-row="2" rowspan="1" colspan="1" tbalign="">$X$染色体</td><td data-row="2" rowspan="1" colspan="1" tbalign="">第Ⅲ染色体</td><td data-row="2" rowspan="1" colspan="1" tbalign="">第Ⅱ染色体</td></tr><tr><td data-row="3" rowspan="2" colspan="1" tbalign="">性状</td><td data-row="3" rowspan="2" colspan="1" tbalign="">野生型(显性纯合子)</td><td data-row="3" rowspan="1" colspan="1" tbalign="">残翅$(v)$</td><td data-row="3" rowspan="1" colspan="1" tbalign="">白眼$(a)$</td><td data-row="3" rowspan="1" colspan="1" tbalign="">毛身$(h)$</td><td data-row="3" rowspan="1" colspan="1" tbalign="">黑身$(b)$</td></tr><tr><td data-row="4" rowspan="1" colspan="4" tbalign="">其余性状均为纯合显性性状</td></tr></tbody></table></div>`
const str = `<div class="text-editor-wrapper"><table align="center"><tbody><tr class="firstRow"><td rowspan="" colspan="" class="yikespec-align-center">$abcd$</span>．区别物质的方法</td><td rowspan="" colspan="" class="yikespec-align-center"><span class="MathJax_SVG" tabindex="0" style="display: inline-block"><svg xmlns:xlink="http://www.w3.org/1999/xlink" width="1.646ex" height="1.978ex" viewBox="0 -750.1 708.5 851.8" role="img" focusable="false" style="vertical-align: -0.236ex;" title="\mathrm B "><defs><path stroke-width="1" id="E238-MJMAIN-42" d="M131 622Q124 629 120 631T104 634T61 637H28V683H229H267H346Q423 683 459 678T531 651Q574 627 599 590T624 512Q624 461 583 419T476 360L466 357Q539 348 595 302T651 187Q651 119 600 67T469 3Q456 1 242 0H28V46H61Q103 47 112 49T131 61V622ZM511 513Q511 560 485 594T416 636Q415 636 403 636T371 636T333 637Q266 637 251 636T232 628Q229 624 229 499V374H312L396 375L406 377Q410 378 417 380T442 393T474 417T499 456T511 513ZM537 188Q537 239 509 282T430 336L329 337H229V200V116Q229 57 234 52Q240 47 334 47H383Q425 47 443 53Q486 67 511 104T537 188Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><use xlink:href="#E238-MJMAIN-42" x="0" y="0"></use></g></svg></span>．微观解释</td></tr><tr><td rowspan="" colspan="" class="yikespec-align-center"><p>白酒和白醋——观察颜色</p><p>棉线和羊毛线——灼烧闻气味</p><p>氢氧化钠和碳酸铵——加盐酸</p></td><td rowspan="" colspan="" class="yikespec-align-center"><p>糖水是混合物——由不同种分子构成</p><p>墙内花开墙外香——分子在不断运动</p><p>溶液导电——存在着自由移动的离子</p></td></tr><tr><td rowspan="" colspan="" class="yikespec-align-center"><span class="MathJax_SVG" tabindex="0" style="display: inline-block"><svg xmlns:xlink="http://www.w3.org/1999/xlink" width="1.678ex" height="2.094ex" viewBox="0 -799.9 722.5 901.7" role="img" focusable="false" style="vertical-align: -0.236ex;" title="\mathrm  C"><defs><path stroke-width="1" id="E239-MJMAIN-43" d="M56 342Q56 428 89 500T174 615T283 681T391 705Q394 705 400 705T408 704Q499 704 569 636L582 624L612 663Q639 700 643 704Q644 704 647 704T653 705H657Q660 705 666 699V419L660 413H626Q620 419 619 430Q610 512 571 572T476 651Q457 658 426 658Q322 658 252 588Q173 509 173 342Q173 221 211 151Q232 111 263 84T328 45T384 29T428 24Q517 24 571 93T626 244Q626 251 632 257H660L666 251V236Q661 133 590 56T403 -21Q262 -21 159 83T56 342Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><use xlink:href="#E239-MJMAIN-43" x="0" y="0"></use></g></svg></span>．日常生活中的化学知识</td><td rowspan="" colspan="" class="yikespec-align-center"><span class="MathJax_SVG" tabindex="0" style="display: inline-block"><svg xmlns:xlink="http://www.w3.org/1999/xlink" width="1.776ex" height="1.978ex" viewBox="0 -750.1 764.5 851.8" role="img" focusable="false" style="vertical-align: -0.236ex;" title="\mathrm D"><defs><path stroke-width="1" id="E240-MJMAIN-44" d="M130 622Q123 629 119 631T103 634T60 637H27V683H228Q399 682 419 682T461 676Q504 667 546 641T626 573T685 470T708 336Q708 210 634 116T442 3Q429 1 228 0H27V46H60Q102 47 111 49T130 61V622ZM593 338Q593 439 571 501T493 602Q439 637 355 637H322H294Q238 637 234 628Q231 624 231 344Q231 62 232 59Q233 49 248 48T339 46H350Q456 46 515 95Q561 133 577 191T593 338Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><use xlink:href="#E240-MJMAIN-44" x="0" y="0"></use></g></svg></span>．物质的性质与用途</td></tr><tr><td rowspan="" colspan="" class="yikespec-align-center"><p>食品中常用的干燥剂——生石灰</p><p>洗涤剂除油污——乳化作用</p><p>架空木柴——增大与氧气的接触面</p></td><td rowspan="" colspan="" class="yikespec-align-center"><p>金刚石切割玻璃——硬度大</p><p>石墨做电极——导电性</p><p>干冰做制冷剂——升华吸热</p></td></tr></tbody></table></div>`
// const str = `<div class="text-editor-wrapper"><table align="center"><tbody><tr class="firstRow"><td rowspan="" colspan="" class="yikespec-align-center"><p>1234</p><p>abcde</p></td></tr></table></div>`
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
