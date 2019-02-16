import Quill from './core';

import { AlignClass, AlignStyle } from './formats/align';
import TkIndent from './formats/indent';

import DottedClass from './formats/dotted';

import Italic from './formats/italic';
import Script from './formats/script';
import TkUnderline from './formats/underline';
import TkStrike from './formats/strike';
import TkBoldClass from './formats/bold';

import Image from './formats/image';
import FillBlankUnderline from './formats/fill-blank-underline';

import Table from './modules/table';
import Toolbar from './modules/toolbar';
import ImageResizer from './modules/image-resizer';

import Icons from './ui/icons';
import Picker from './ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import TextPicker from './ui/text-picker';

import SnowTheme from './themes/snow';
import TikuTheme from './themes/tiku';
import HandoutTheme from './themes/handout';
import List from './formats/list';
import { FontStyle } from './formats/font';
import { SizeStyle } from './formats/size';
import LineHeightStyle from './formats/line-height';

window.sizeStyle = SizeStyle;

Quill.register(
  {
    'attributors/class/align': AlignClass,
    'attributors/style/align': AlignStyle,
    'formats/align': AlignClass,

    'attributors/class/dotted': DottedClass,
    'attributors/class/tkFormat': TkUnderline,
    'attributors/class/italic': Italic,
    'attributors/class/strike': TkStrike,

    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,
    'attributors/style/line-height': LineHeightStyle,
  },
  true,
);

Quill.register(
  {
    'formats/indent': TkIndent,
    'formats/strike': TkStrike,

    'formats/dotted': DottedClass,

    'formats/italic': Italic,
    'formats/script': Script,
    'formats/tkFormat': TkUnderline,
    'formats/TkBold': TkBoldClass,

    'formats/image': Image,
    'formats/fillBlankUnderline': FillBlankUnderline,
    'formats/list': List,
    'formats/font': FontStyle,
    'formats/size': SizeStyle,
    'formats/line-height': LineHeightStyle,

    'modules/table': Table,
    'modules/toolbar': Toolbar,
    'modules/image-resizer': ImageResizer,

    'themes/snow': SnowTheme,
    'themes/tiku': TikuTheme,
    'themes/handout': HandoutTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/color-picker': ColorPicker,
    'ui/text-picker': TextPicker,
  },
  true,
);

export default Quill;
