一课团队富文本编辑器，目前适用于讲义系统，基于 quill.js 二次开发。

## 快速上手

```html
<link rel="stylesheet" href="text-editor.css">
<link rel="stylesheet" href="yike-iframe.css">

<div id="editor"></div>

<script src="demo.js"></script>
```

`demo.js`

```javascript
import Editor from 'text-editor';

const editor = new Editor({
  container: '#editor',
  theme: 'handout',
  events: {
    openFormula,
    getFormat,
  },
  options: [
    {
      font: ['sans-serif', 'Arial'],
    },
    {
      bold: ['normal'],
    }
  ],
});
```

注意：目前样式文件还未上传至 cdn，`text-editor.css`请引用 `dist/text-editor.css`，`yike-iframe.css`请引用`dist/yike-iframe.css`。

另外，如果使用插入公式功能，宿主环境要求MathJax、canvg第三方库，参考如下：

```html
<script src="https://yy-s.zuoyebang.cc/static/mathjax_274/MathJax.js?config=default-full-min"></script>
<script src="https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js"></script>
```

## 参数说明

| 参数名      | 类型           | 必要性 | 默认值        | 取值范围                          | 描述                               |
| ----------- | -------------- | ------ | ------------- | --------------------------------- | ---------------------------------- |
| container   | string \| Node | 可选   | document.body | 无                                | 编辑器容器                         |
| options     | array          | 必选   | []            | 见[options 说明](#options-说明)   | 可选的样式                         |
| initContent | string         | 可选   | ''            | 无                                | 初始化内容，可以是文本或html字符串 |
| events      | object         | 可选   | {}            | 见[events 说明](#events-说明)     | 传入的事件                         |
| keyboard    | object         | 可选   | {}            | 见[keyboard 说明](#keyboard-说明) | 处理键盘事件                       |

### options 说明

示例：

```javascript
[
  {
    font: ['sans-serif', 'Arial'],
  },
  {
    bold: ['normal'],
  },
  'color', // 没有限制
  {
    align: ['left', 'right', 'center']
  },
  {
    underline: ['normal']
  }
]
```



| 可选值                 | 白名单                    | 格式影响范围 | 说明                   | 对应class                                                  |
| ---------------------- | ------------------------- | ------------ | ---------------------- | ---------------------------------------------------------- |
| bold                   | 'normal'                  | 行内文本     | 粗体                   | tkspec-bold-normal                                         |
| italic                 | 'normal'                  | 行内文本     | 斜体                   | tkspec-italic-normal                                       |
| underline              | 'normal', 'wavy'          | 行内文本     | 下划线（直线、波浪线） | tkspec-underline-normal，tkspec-underline-wavy             |
| strike                 | 'normal'                  | 行内文本     | 删除线                 | tkspec-strike-normal                                       |
| dotted                 | 'normal'                  | 行内文本     | 着重号                 | tkspec-dotted-normal                                       |
| script                 | 'super, 'sub''            | 行内文本     | 上标、下标             | tkspec-script-super，tkspec-script-sub                     |
| font                   | 任意，不设置则没有限制    | 行内文本     | 字体                   |                                                            |
| size                   | 任意，不设置则没有限制    | 行内文本     | 字号                   |                                                            |
| color                  | 任意，不设置则没有限制    | 行内文本     | 文本颜色               |                                                            |
| background             | 任意，不设置则没有限制    | 行内文本     | 文本背景颜色           |                                                            |
| text-indent            | 'normal                   | 段落         | 首行增加缩进           | tkspec-text-indent-normal                                  |
| indent                 | '+1', '-1'                | 段落         | 段落增加缩进，减少缩进 | tkspec-indent-1，tkspec-indent-2 …… tkspec-indent-8        |
| align                  | 'left', 'center', 'right' | 段落         | 段落对齐样式           | tkspec-align-left，tkspec-align-center，tkspec-align-right |
| line-height            | 任意，不设置则没有限制    | 段落         | 行高                   |                                                            |
| list                   | 'ordered'                 | 段落         | 列表                   |                                                            |
| paragraph-bottom-space | 'normal'                  | 段落         | 段后距                 | tkspec-paragraph-bottom-space-normal                       |

### events 说明

| 方法名    | 返回值 | 参数 | 说明                                   |
| --------- | ------ | ---- | -------------------------------------- |
| getFormat | object | 无   | 点击编辑区域时触发以获取光标区域的样式 |

### keyboard 说明

以下方代码为例，可以禁止回车事件

```javascript
  keyboard: {
    bindings: {
      handleEnter: {
        key: 'Enter',
        metaKey: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        handler: function() {}
      }，
      // 禁止 shift + Enter 按键
      handleAnotherEnter: {
        key: 'Enter',
        shiftKey: true,
        handler: function() {}
      }
    }
  },
```

参数说明：

key: 按键

handler: 事件回调

metaKey, ctrlKey, shiftKey, altKey 表示组合按键，默认是null。如需组合设置对应值为 true



## API

| 方法名                | 返回值       | 参数                    | 说明                                                         |
| --------------------- | ------------ | ----------------------- | ------------------------------------------------------------ |
| format                | 无           | (format, value)         | 设置文本、段落样式，format是参数options取值范围内，value是对应值。例如：`editor.format('align', 'center')`;value是false时，取消对应样式 |
| setContent            | 无           | htmlString              | 设置内容，参数是html字符串                                   |
| getContent            | htmlString   | 无                      | 获取内容                                                     |
| setData               | 无           | object                  | 设置格式化数据                                               |
| getData               | object       | 无                      | 获取格式化数据                                               |
| insertEmbed           | 无           | （index，embed，value） | embed可选值 'ql-mathjax'                                     |
| undo                  | 无           | 无                      | 撤回操作                                                     |
| redo                  | 无           | 无                      | 还原操作                                                     |
| splitContent          | [prev, next] | 无                      | 获得光标前后的内容，prev是光标前内容，next是光标后内容，都是html字符串 |
| setSelection          | 无           | (index, length)         | 设置编辑器选区。index为光标位置，length为range长度           |
| isBlank               | boolean      | 无                      | 内容是否为空                                                 |
| setKeyboardBindings | 无           | object                  | 重新设置自定义的keyboard事件，参数见[keyboard说明](#keyboard-说明) |

