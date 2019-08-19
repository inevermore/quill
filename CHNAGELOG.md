## 1.2.0-beta

* feat: 支持表格单元格合并、取消合并

## 1.1.6

* fix: latex中$不匹配转化异常

## 1.1.5

* fix: latex中有&amp;符号bug

## 1.1.4

* style: 表格相关代码优化
* fix: 多行列单元格展示bug

## 1.1.3

* refactor: table 重构，单元格内段落使用p标签表示

## 1.0.2-beta.3

* fix: table撤销插入行列bug

## 1.0.2-beta.2

* fix: getContent未获取到表格浮动样式

## 1.0.2-beta.1

* fix: table重构兼容历史数据

## 1.0.6

* optimize: 公式白名单增加字符

## 1.0.5

* optimize: 公式白名单增加字符

## 1.0.4

* optimize 调整toolbar z-index，降低层级

## 1.0.3

* optimize 优化latex2svg，

## 1.0.2

* bugfix 公式在首行时，工具栏svg2latex按钮失效

## 1.0.1

* update latex2svg逻辑
* add 插入公式标红非法字符

注：由于编辑器已在题库、讲义生产环境稳定使用，故更新主版本号

## 0.4.55

* add latex2svg 新增 noAlert 配置

## 0.4.54

* bugfix svg2latex

## 0.4.52

* bugfix 兼容表格内有p标签

## 0.4.51

* bugfix svg2latex bug

## 0.4.43

* bugfix table居中
## 0.4.42

* update table内容默认居中

## 0.4.41

* bugfix latex2svg bug && 光标优化

## 0.4.4

* update 打开公式编辑器初始化设置弹窗位置（偏右320）
* bugfix 关闭公式编辑器设置光标位置

## 0.4.35

* add 点击图片可以复制

## 0.4.34

* bugfix 插入公式bug

## 0.4.33

* bugfix 优化latex svg转化逻辑

## 0.4.31

* bugfix table居中样式丢失问题

## 0.4.3

* bugfix table居中样式丢失问题

## 0.4.26

* update 优化标准下划线、括号样式

## 0.4.25

* update 优化插入公式逻辑

## 0.4.24

* update 调整标准下划线长度，使用空格

## 0.4.23

* update 调整标准下划线长度为4

## 0.4.22

* del 去除autoprefixer warning样式
* add 兼容历史下划线样式

## 0.4.21

* update 调整加点字实现方案

## 0.4.2

* bugfix scroll事件监听问题

## 0.4.1

* update table内保留换行样式
* style 提升插入拼音浮层优先级
* style 调整对角线色值

## 0.4.0

* update list功能增加白名单机制
* update enableSingleLine 禁止list auto fill
* bugfix 提高table插入浮层优先级；fix插入表格触发滚动问题；滑动时隐藏table插入浮层

## 0.3.85

* update 插入表格区域样式调整

## 0.3.84

* bugfix 插入表格区域被覆盖问题

## 0.3.83

* bugfix 从word复制表格展现问题

## 0.3.82

* bugfix 兼容table浮动样式

## 0.3.81

* bugfix table合并bug

## 0.3.8

* bugfix 表格对角线样式优先级提升；兼容历史数据（居右样式）

## 0.3.79

* bugfix 插入表格、换行时滚动问题

## 0.3.78

* bugfix 若干bug

## 0.3.74

* bugfix windows系统复制粘贴出现换行
* bugfix 首行缩进换行时光标位置错误

## 0.3.73

* bugfix some table problems

## 0.3.72

* update 同步线上latex过滤逻辑

## 0.3.71

* update svg左右存在空白样式优化

## 0.3.7

* update 保留table 合并单元格样式
* update 调整table内文本样式

## 0.3.62

* bugfix 回车、删除按键行为不符合预期

## 0.3.61

* UPDATE latex2svg、svg2latex快捷键提示

## 0.3.6

* ADD 快捷键：svg2latex（alt + x）、latex2svg（alt + s）
* UPDATE latex/svg互转代码

## 0.3.5

* FIX 撤回/重做在vue中的bug
* ADD 清空的弹窗提示
* FIX 工具栏换行样式
* FIX 表格居右时，可以在左侧输入文字
* FIX 插入表格时嵌入本行内容

## 0.3.4

* FIX table对角线预览消失问题

## 0.3.3

* DELETE 过滤空格逻辑

## 0.3.2

* FIX 多编辑器时无法插入表格

## 0.3.0

* ADD 表格功能
* UPDATE 优化latex2svg逻辑

## 0.2.6

* UPDATE 兼容讲义系统，去除报错

## 0.2.5

* UPDATE 优化latex2svg逻辑

## 0.2.4

* FIX 填空题空格、填空题下划线、括号、公式二次编辑bug
* UPDATE latex2svg转化逻辑，避免一个latex错误导致全部无法转化的问题
* FIX latex中包含\$转化错误的bug

## 0.2.31

* try to fix bug

## 0.2.3

* DELETE remove emitter set-content event

## 0.2.1

* FIX 填空题空格、填空题下划线、括号、公式setContent时产生错误数据的bug
* UPDATE 调整填空题样式问题，避免外部样式影响

## 0.2.0

* ADD 调整fill-blank-order结构以和原数据保持一致

## 0.1.9

* ADD editor类添加Quill属性

## 0.1.8

* UPDATE 公式编辑器域名改为jymis

## 0.1.7
* FIX 小学数学填空题小题空格增删逻辑bug
* FIX 复制单个单元格时，加上table标签bug

## 0.1.6

* UPDATE 优化填空题逻辑
* setContent 调用clipboard.onPaste方法

## 0.1.5

* ADD 填空题空和小题增删逻辑

## 0.1.4

* ADD 接入新公式编辑器，多文本编辑器对应一个公式编辑器

## 0.1.3

* FIX snow theme 工具栏bug

## 0.1.2

* ADD 添加图片上传时类型错误提示
* FIX 题库工具栏bug

## 0.1.1

* ADD 支持题库系统

## 0.1.0

* ADD 支持题库系统
* UPDATE 调整工具栏样式
* ADD 添加填空题支持
  
## 0.0.906

* FIX 图片上传bug
  
## 0.0.905

* FIX ajax.js bug

## 0.0.904

* ADD 添加图片上传可配置request参数key

## 0.0.903

* FIX 首行缩进时段落标记符同时缩进问题
* FIX 中文输入时，删除按钮不符合预期问题

## 0.0.902

* UPDATE README.md

## 0.0.9

* ADD 支持图片上传参数配置

## 0.0.896

* FIX 连续空段落按上/下键光标未逐行移动
* FIX 文本占整行时段落标识符跳到下一行，未跟随文本

## 0.0.895

* UPDATE 调整段后距间距为 13px

## 0.0.894

* FIX 列表功能在添加公式后编号上移bug

## 0.0.893

* FIX 分行功能删除bug

## 0.0.892

* UPDATE 调整首行缩进为2个中文字符

## 0.0.891

* UPDATE 调整pargraph-mark样式display：none，以修复空段落居中/首行缩进的光标问题

## 0.0.89

* ADD 默认快捷键：加粗（ctrl/command + b）、斜体（ctrl/command + i）

## 0.0.88

* UPDATE 去除setSelection触发focus事件，避免页面滚动

## 0.0.87

* FIX splitContent方法没有外层div封装问题

## 0.0.86

* ADD 段落标识
* UPDATE 替换段落默认节点br为空span，class 为 paragraph-mark

## 0.0.85

* 无修改

## 0.0.84

* FIX setKeyboardBindings方法导致键盘事件紊乱，去除此方法
* ADD enableSingleLine方法，支持设置单行/多行模式

## 0.0.83

* FIX setKeyboardBindings方法导致编辑器失焦

## 0.0.82

* UPDATE 添加word-break样式，防止外部样式影响
  
## 0.0.81

* ADD setKeyboardBindings接口，支持重设自定义键盘事件

## 0.0.8

* ADD 支持分行功能（shift + enter）

## 0.0.710

* 支持自定义键盘事件

## 0.0.702

* UPDATE readme.md

## 0.0.701

* FIX 列表功能可能导致出现重复序号的dom
* ADD 段后距功能
* UPDATE getContent返回值添加wrapper，防止外部css影响富文本样式

## 0.0.700

* FIX 公式后输入多个中文字符光标位置的问题
* ADD 点击公式实现选中效果