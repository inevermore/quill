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