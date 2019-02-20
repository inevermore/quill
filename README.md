#text-editor

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

| 参数名      | 类型           | 必要性 | 默认值        | 取值范围          | 描述                               |
| ----------- | -------------- | ------ | ------------- | ----------------- | ---------------------------------- |
| container   | string \| Node | 可选   | document.body | 无                | 编辑器容器                         |
| options     | array          | 必选   | []            | 见下方options说明 | 支持的修改样式                     |
| initContent | string         | 可选   | ''            | 无                | 初始化内容，可以是文本或html字符串 |
| events      | object         | 可选   | {}            | 见下方events说明  | 传入的事件                         |

### options 说明

#### 示例

```javascript
[
  {
    font: ['sans-serif', 'Arial'],
  },
  {
    bold: ['normal'],
  }
]
```

#### 取值范围

| 格式        | 白名单                    | 格式影响范围 | 描述         |
| ----------- | ------------------------- | ------------ | ------------ |
| bold        | 'normal'                  | 行内文本     |              |
| italic      | 'normal'                  | 行内文本     |              |
| underline   | 'normal', 'wavy'          | 行内文本     |              |
| strike      | 'normal'                  | 行内文本     |              |
| dotted      | 'normal'                  | 行内文本     |              |
| script      | 'sub', 'super'            | 行内文本     |              |
| strike      | 'normal'                  | 行内文本     |              |
| font        | 任意，不设置则没有限制    | 行内文本     |              |
| size        | 任意，不设置则没有限制    | 行内文本     |              |
| color       | 任意，不设置则没有限制    | 行内文本     |              |
| background  | 任意，不设置则没有限制    | 行内文本     |              |
| indent      | 'normal'                  | 段落         |              |
|             |                           |              |              |
| line-height | 任意，不设置则没有限制    | 段落         |              |
|             |                           |              |              |
|             |                           |              |              |
|             |                           |              |              |
| align       | 'left', 'center', 'right' | 段落         | 段落对齐样式 |

# develop
### 运行 demo 项目
1. `npm run start`
2. 打开[http://localhost:9080/handout/demo.html](http://localhost:9080/handout/demo.html)

### 编译打包
npm run build

