const WHITE_LIST = /[0-9a-zA-Z\u4e00-\u9fa5%\\()[\]{}|^_/*+-<>=!.&,'↲:$ ①②③④⑤⑥⑦⑧⑨⑩]+/;
let dirtyList = [];
function _filter (latex) {
  latex = latex.replace(/&nbsp;/g, '').replace(/\/\//g, '\\ykparallel ').trim();
  let tempArr = latex.split('');
  return tempArr.map((v, i) => {
    if (WHITE_LIST.test(v) || (v === '#' && tempArr.slice(i - 1, i + 4).join('') === '&#39;')) {
      return v;
    } else {
      dirtyList.push(v);
      return '';
    }
  }).join('');
}
// latexArr: ['$a<b$', '$a&lt;b$']
// return: latex绝对是<、>非转义的
function getMathImgSrcList (latexArr) {
  latexArr = latexArr.map(latex => _filter(latex));
  let doc = document.implementation.createHTMLDocument();
  latexArr.forEach(latex => {
    let div = doc.createElement('div');
    div.innerHTML = latex.replace(/>/g, '&gt;').replace(/</g, '&lt;');
    doc.body.appendChild(div);
  });
  return new Promise((resolve, reject) => {
    function rendered () {
      let area = document.getElementById('drawImage');
      let list = [];
      Array.from(doc.querySelectorAll('svg')).forEach((svg, index) => {
        canvg(area, svg.outerHTML);
        list.push({
          src: area.toDataURL('image/png'),
          latex: latexArr[index].slice(1, latexArr[index].length - 1).replace(/&gt;/g, '>').replace(/&lt;/g, '<')
        });
      });
      resolve(list);
    }
    MathJax.Hub.Queue(
      ['Typeset', MathJax.Hub, doc.body],
      [rendered]
    );
  });
}

UE.registerUI('latex2svg',function(editor,uiName,name){
    editor.addshortcutkey("latex2svg", "ctrl+66");
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
      execCommand:function(actionName, notConvertImg, name){
        if (editor._latex2Imging) {
          alert('正在转换中，请勿连续点击');
          return;
        }
        editor._latex2Imging = true;
        let html = editor.getContent();
        html = html.replace(/\\\$/g, 'MATHCUSTOM').replace(/\n/g, '');
        // 1. 写入doc，所有yk-math且纯文本的，全变为纯文本
        let doc = document.implementation.createHTMLDocument();
        doc.write(html);
        // 2. 匹配所有 $$ ，直接生成对应的img
        if (notConvertImg) {
          editor.body.innerHTML = doc.body.innerHTML.replace(/\$(.*?)\$/g, _filter).replace(/MATHCUSTOM/g, '\\$');
          editor._latex2Imging = false;
        } else {
          getMathImgSrcList(doc.body.innerHTML.match(/\$(.*?)\$/g) || [])
            .then(objList => {
              let count = 0;
              editor.body.innerHTML = doc.body.innerHTML
                .replace(/\$(.*?)\$/g, function (latex) {
                  let img = `<img class="yk-math-img" data-latex="${objList[count].latex}" src="${objList[count].src}">`;
                  count++;
                  return img;
                })
                .replace(/MATHCUSTOM/g, '\\$');
              editor._latex2Imging = false;
            });
        }
        // 下边逻辑无关痛痒
        dirtyList.length && alert(`数学公式中存在非法字符: ${dirtyList.map(v => `'${v}'`).join(', ')} 请重新以latex录入`);
        dirtyList = [];
        editor.selection.getRange().setCursor(false);
        editor.selection.getRange().select()
      }
    });

    // 创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:'LaTex 转为 SVG(ctrl+b)',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        // cssRules :'background-position: -500px 0;',
        //点击时执行的命令
        onclick:function () {
          //这里可以不用执行命令,做你自己的操作也可
          editor.execCommand(uiName);
        }
    });

    //当点到编辑内容上时，按钮要做的状态反射
    // editor.addListener('selectionchange', function () {
    //     var state = editor.queryCommandState(uiName);
    //     if (state == -1) {
    //         btn.setDisabled(true);
    //         btn.setChecked(false);
    //     } else {
    //         btn.setDisabled(false);
    //         btn.setChecked(state);
    //     }
    // });

    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);