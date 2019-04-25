function getMathImgSrcList (latexArr) {
  // 因为公式编辑器已经在编辑过滤，所有这里不做filter
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
      Array.from(doc.querySelectorAll('.MathJax_SVG')).forEach((svgContainer, index) => {
        canvg(area, svgContainer.innerHTML);
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
UE.registerUI('latexeditor', function(editor,uiName){
  // console.log(window.location.href.includes('/exam-manage'));
  console.log(editor.options.UEDITOR_HOME_URL);
  //创建dialog
  var dialog = new UE.ui.Dialog({
      //指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
      iframeUrl:editor.options.UEDITOR_HOME_URL + '../static/plugin/ueditor/latex-editor-plugin/latex-editor.html',
      //需要指定当前的编辑器实例
      editor:editor,
      //指定dialog的名字
      name:uiName,
      //dialog的标题
      title:"作业帮理科公式编辑器",

      //指定dialog的外围样式
      cssRules:"width:710px;height:544px;"
    });

    editor.addListener('insertlatex', function (eventName, latex, container) {
      getMathImgSrcList([latex])
        .then(objList => {
          if (container) {
            container.outerHTML = `<img class="yk-math-img" data-latex="${objList[0].latex}" src="${objList[0].src}">`;
          } else {
            editor.execCommand('inserthtml', `<img class="yk-math-img" data-latex="${objList[0].latex}" src="${objList[0].src}">`);
          }
          dialog.close(true);
        })
    });

    let results = null;

    editor.addListener('editsvg', function (eventName, result) {
      results = result;
      dialog.render();
      dialog.open();
    });

    editor.addListener('latexeditorload', function () {
      if (!results) return;
      editor.fireEvent('initlatexeditor', results);
      results = null;
    });

  //参考addCustomizeButton.js
  var btn = new UE.ui.Button({
      name:'latex editor',
      title:'新建公式(ctrl+m)',
      //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
      // cssRules :'background-image: url("' + 'http://camnpr.com/upload/2014/7/201407011438228175.jpg' + '")!important;',
      onclick:function () {
          //渲染dialog
          dialog.render();
          dialog.open();
      }
  });

  return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);