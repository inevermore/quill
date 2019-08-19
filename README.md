

富文本编辑器

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

另外，如果使用插入公式功能，宿主环境要求MathJax库，例如：

```html
<script src="https://yy-s.zuoyebang.cc/static/mathjax_274/MathJax.js?config=default-full-min"></script>
```

## 参数说明

| 参数名      | 类型           | 必要性 | 默认值        | 取值范围                  | 描述                               |
| ----------- | -------------- | ------ | ------------- | ------------------------- | ---------------------------------- |
| container   | String \| Node | 可选   | document.body | 无                        | 编辑器容器                         |
| theme       | String         | 必选   |               | tiku、handout、platform   | 主题，目前支持题库、讲义、平台     |
| options     | Array          | 必选   | []            | 见下方 options 说明       | 可选的样式                         |
| toolbar     | Object         | 可选   |               | 见下方toolbar说明         | 设置toolbar按钮事件                |
| initContent | String         | 可选   | ''            | 无                        | 初始化内容，可以是文本或html字符串 |
| events      | Object         | 可选   | {}            | 见下方 events 说明        | 传入的事件                         |
| keyboard    | Object         | 可选   | {}            | 见下方 keyboard 说明      | 处理键盘事件                       |
| uploader    | Object         | 可选   | {}            | 见下方 uploader 说明      | 配置图片上传参数（url、参数...）   |
| subject     | Number         | 可选   |               | 2(数学), 4(物理), 5(化学) | 学科配置                           |

### options 说明

示例：

```javascript
[
  {
    bold: ['normal'],
  },
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
| text-indent            | 'normal'                  | 段落         | 首行增加缩进           | tkspec-text-indent-normal                                  |
| align                  | 'left', 'center', 'right' | 段落         | 段落对齐样式           | tkspec-align-left，tkspec-align-center，tkspec-align-right |
| line-height            | 任意，不设置则没有限制    | 段落         | 行高                   |                                                            |
| list                   | 'ordered'                 | 段落         | 列表                   |                                                            |
| paragraph-bottom-space | 'normal'                  | 段落         | 段后距                 | tkspec-paragraph-bottom-space-normal                       |
| undo                   | 无                        |              | 撤回                   |                                                            |
| redo                   | 无                        |              | 重做                   |                                                            |
| select-all             | 无                        |              | 全选                   |                                                            |
| clear                  | 无                        |              | 清空                   |                                                            |
| image                  | 无                        |              | 上传图片               |                                                            |
| fill-blank-order       | 无                        |              | 填空题序号             | fill-blank                                                 |
| fill-blank-underline   | 无                        |              | 填空题空格             | tkspec-fill-blank-underline                                |
| fill-blank-brackets    | 无                        |              | 括号                   | tkspec-fill-blank-brackets                                 |
| formula-editor         | 无                        |              | 打开公式编辑器         |                                                            |
| latex2svg              | 无                        |              | latex转化为svg         |                                                            |
| svg2latex              | 无                        |              | svg转化为latex         |                                                            |
| pinyin                 | 无                        |              | 打开拼音               |                                                            |
| table-insert           | 无                        |              | 插入表格               |                                                            |

### toolbar 说明

以下方代码为例，设置插入填空题序号事件

```js
toolbar: {
  handlers: {
    'fill-blank-order': function() {
      const savedIndex = this.quill.selection.savedRange.index;
      this.quill.insertEmbed(savedIndex, 'fill-blank-order', '1');
      this.quill.setSelection(savedIndex + 1, 0);
    }
  }
},
```



### events 说明

| 方法名           | 返回值 | 参数                                                         | 说明                                             |
| ---------------- | ------ | ------------------------------------------------------------ | ------------------------------------------------ |
| getFormat        | object | 无                                                           | 点击编辑区域时触发以获取光标区域的样式           |
| blankOrderChange | 无     | type（操作类型：add/del/clear），changeList（变化列表），maxLen（序号最多数量） | 填空题序号变化事件，当删除、复制、清空文档时触发 |

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

### uploader 说明

以下方代码为例: 

```javascript
  uploader: {
    param: 'upfile',
    mimetypes: ['image/png', 'image/jpg', 'image/jpeg']  //默认三种格式
    url: '/zbtiku/tiku/imgupload?action=uploadimage',
    method: 'post',
    maxSize: 600,
    response: ['data', 'url'],
  }
```

参数释义：

param: 图片参数 key

mimetypes：图片格式，默认 ['image/png', 'image/jpg', 'image/jpeg']

url： 图片上传接口，为空则使用base64存储

method：http 请求方法

maxSize: 图片最大体积，单位 KB

response：返回数据，图片 url 数据结构。如果设为 ['data', 'url']，则取 response.data.url 作为图片url

接口上传参数默认为 FormData



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
| ~~setKeyboardBindings~~ | ~~无~~       | ~~object~~              | ~~重新设置自定义的keyboard事件，参数见keyboard说明~~ |
| enableSingleLine | 无 | boolean | 设置/取消单行模式，boolean为true单行模式，否则为多行模式 |

## 历史版本变动
https://git.afpai.com/yike_fe/text-editor/blob/dev/CHNAGELOG.md
