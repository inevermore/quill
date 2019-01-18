import Quill from './core';

import TkAlignClass from './formats/tk-align';
import TkIndent from './formats/tk-indent';

import { DottedClass, DottedStyle } from './formats/dotted';

import Italic from './formats/italic';
import Script from './formats/script';
import TkFormatClass from './formats/tk-underline';
import TkStrike from './formats/tk-strike';
import TkBoldClass from './formats/tk-bold';

import Image from './formats/image';
import FillBlankUnderline from './formats/fill-blank-underline';

import Syntax from './modules/syntax';
import Table from './modules/table';
import Toolbar from './modules/toolbar';
import ImageResizer from './modules/image-resizer';

import Icons from './ui/icons';
import Picker from './ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import TextPicker from './ui/text-picker';

import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';
import TikuTheme from './themes/tiku';

Quill.register(
  {
    'attributors/class/align': TkAlignClass,
    'formats/align': TkAlignClass,

    // 'attributors/class/dotted': DottedClass,
    'attributors/class/tkFormat': TkFormatClass,
    'attributors/class/italic': Italic,
    'attributors/class/tk-strike': TkStrike,
  },
  true,
);

Quill.register(
  {
    'formats/tk-indent': TkIndent,
    'formats/tk-strike': TkStrike,

    // 'formats/dotted': DottedStyle,

    'formats/italic': Italic,
    'formats/script': Script,
    'formats/tkFormat': TkFormatClass,
    'formats/TkBold': TkBoldClass,

    'formats/image': Image,
    'formats/fillBlankUnderline': FillBlankUnderline,

    'modules/syntax': Syntax,
    'modules/table': Table,
    'modules/toolbar': Toolbar,
    'modules/image-resizer': ImageResizer,

    'themes/bubble': BubbleTheme,
    'themes/snow': SnowTheme,
    'themes/tiku': TikuTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/color-picker': ColorPicker,
    'ui/text-picker': TextPicker,
  },
  true,
);

export default Quill;
