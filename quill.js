import Quill from './core';

import { AlignClass, AlignStyle } from './formats/align';
import {
  DirectionAttribute,
  DirectionClass,
  DirectionStyle,
} from './formats/direction';
import Indent from './formats/indent';

import Blockquote from './formats/blockquote';
import Header from './formats/header';
import List from './formats/list';

import { BackgroundClass, BackgroundStyle } from './formats/background';
import { ColorClass, ColorStyle } from './formats/color';
import { FontClass, FontStyle } from './formats/font';
import { SizeClass, SizeStyle } from './formats/size';
import DottedClass from './formats/dotted';

import Bold from './formats/bold';
import Italic from './formats/italic';
import Link from './formats/link';
import Script from './formats/script';
import Strike from './formats/strike';
import Underline from './formats/underline';
import TkFormatClass from './formats/underline';

import Formula from './formats/formula';
import Image from './formats/image';
import Video from './formats/video';
import FillBlankUnderline from './formats/fill-blank-underline';

import CodeBlock, { Code as InlineCode } from './formats/code';

import Syntax from './modules/syntax';
import Table from './modules/table';
import Toolbar from './modules/toolbar';

import Icons from './ui/icons';
import Picker from './ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import Tooltip from './ui/tooltip';
import TextPicker from './ui/text-picker';

import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';
import TikuTheme from './themes/tiku';

Quill.register(
  {
    'attributors/class/align': AlignClass,
    'attributors/style/align': AlignStyle,
    'formats/align': AlignClass,
    'attributors/attribute/direction': DirectionAttribute,

    'attributors/class/background': BackgroundClass,
    // 'attributors/class/color': ColorClass,
    'attributors/class/direction': DirectionClass,
    'attributors/class/font': FontClass,
    'attributors/class/size': SizeClass,
    'attributors/class/dotted': DottedClass,
    'attributors/class/tkFormat': TkFormatClass,
    'attributors/class/italic': Italic,

    'attributors/style/background': BackgroundStyle,
    'attributors/style/color': ColorStyle,
    'attributors/style/direction': DirectionStyle,
    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,
    // 'attributors/style/dotted': DottedStyle,
  },
  true,
);

Quill.register(
  {
    'formats/direction': DirectionClass,
    'formats/indent': Indent,

    // 'formats/background': BackgroundStyle,
    'formats/color': ColorStyle,
    'formats/font': FontClass,
    'formats/size': SizeClass,
    'formats/dotted': DottedClass,

    'formats/blockquote': Blockquote,
    'formats/code-block': CodeBlock,
    'formats/header': Header,
    'formats/list': List,

    'formats/bold': Bold,
    'formats/code': InlineCode,
    'formats/italic': Italic,
    'formats/link': Link,
    'formats/script': Script,
    'formats/tkFormat': TkFormatClass,
    'formats/strike': Strike,
    'formats/underline': Underline,

    'formats/formula': Formula,
    'formats/image': Image,
    'formats/video': Video,
    'formats/fillBlankUnderline': FillBlankUnderline,

    'modules/syntax': Syntax,
    'modules/table': Table,
    'modules/toolbar': Toolbar,

    'themes/bubble': BubbleTheme,
    'themes/snow': SnowTheme,
    'themes/tiku': TikuTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/color-picker': ColorPicker,
    'ui/text-picker': TextPicker,
    'ui/tooltip': Tooltip,
  },
  true,
);

export default Quill;
