import Quill from './core';

import { AlignClass, AlignStyle } from './formats/align';
import IndentClass from './formats/indent';

import DottedClass from './formats/dotted';

import ItalicClass from './formats/italic';
import Script from './formats/script';
import UnderlineClass from './formats/underline';
import Strike from './formats/strike';
import BoldClass from './formats/bold';
import { ColorStyle } from './formats/color';
import { BackgroundStyle } from './formats/background';

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

Quill.register(
  {
    'attributors/class/align': AlignClass,
    'attributors/class/underline': UnderlineClass,
    'attributors/style/align': AlignStyle,

    'attributors/class/dotted': DottedClass,
    'attributors/class/italic': ItalicClass,
    'attributors/class/strike': Strike,

    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,
    'attributors/style/line-height': LineHeightStyle,
    'attributors/style/color': ColorStyle,
    'attributors/style/background': BackgroundStyle,
  },
  true,
);

Quill.register(
  {
    'formats/image': Image,

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

const FORMATS = {
  align: AlignClass,
  indent: IndentClass,
  strike: Strike,
  dotted: DottedClass,
  italic: ItalicClass,
  underline: UnderlineClass,
  script: Script,
  bold: BoldClass,
  image: Image,
  'fill-blank-underline': FillBlankUnderline,
  list: List,
  font: FontStyle,
  size: SizeStyle,
  'line-height': LineHeightStyle,
  color: ColorStyle,
  background: BackgroundStyle,
};

function register(options) {
  options.forEach(item => {
    if (FORMATS[item] == null) {
      return;
    }

    Quill.register(
      {
        [`formats/${item}`]: FORMATS[item],
      },
      true,
    );
  });
}

export { Quill as default, register };
