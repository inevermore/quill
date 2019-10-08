UE.registerUI('svg2latex', function (editor, uiName, name) {
  editor.registerCommand(uiName, {
    execCommand: function (actionName) {
      if (editor._img2Latexing) {
        alert('正在转换中，请勿连续点击')
        return;
      }
      editor._img2Latexing = true
      // 点击按钮执行的逻辑
      // 1. 如果有选中的range，只处理range
      let range = editor.selection.getRange();
      if (range.cloneContents()) {
        range.traversal(function doFn (node) {
          node.outerHTML = `$${node.getAttribute('data-latex').replace(/>/g, '&gt;').replace(/</g, '&lt;')}$`;
        }, function filterFn (node) {
          return node.getAttribute && node.getAttribute('class') === 'yk-math-img';
        });
        editor._img2Latexing = false
        return
      }
      // 2. 否则转换全局
      let html = editor.getContent()
      let doc = document.implementation.createHTMLDocument()
      doc.write(html)
      let imgs = doc.querySelectorAll('.yk-math-img')
      Array.from(imgs).forEach(img => {
        img.outerHTML = `$${img.getAttribute('data-latex').replace(/>/g, '&gt;').replace(/</g, '&lt;')}$`
      })
      editor.body.innerHTML = doc.body.innerHTML
      editor._img2Latexing = false
    }
  })

  var btn = new UE.ui.Button({
    name: uiName,
    title: 'SVG 转为 LaTex',
    onclick: function () {
      editor.execCommand(uiName)
    }
  })

  // editor.addListener('selectionchange', function () {
  //   var state = editor.queryCommandState(uiName)
  //   if (state === -1) {
  //     btn.setDisabled(true)
  //     btn.setChecked(false)
  //   } else {
  //     btn.setDisabled(false)
  //     btn.setChecked(state)
  //   }
  // })

  return btn
})
