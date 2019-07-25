import Quill from '../../core';

import { AlignClass } from '../../formats/align';
import IndentClass from '../../formats/indent';
import TextIndentClass from '../../formats/text-indent';

import DottedClass from '../../formats/dotted';

import ItalicClass from '../../formats/italic';
import Script from '../../formats/script';
import UnderlineClass from '../../formats/underline';
import Strike from '../../formats/strike';
import BoldClass from '../../formats/bold';
import { ColorStyle } from '../../formats/color';
import { BackgroundStyle } from '../../formats/background';

import Image from '../../formats/image';

import List from '../../formats/list';
import { FontStyle } from '../../formats/font';
import { SizeStyle } from '../../formats/size';
import LineHeightStyle from '../../formats/line-height';
import ParagraphBottomSpaceClass from '../../formats/paragraph-bottom-space';
// import TextLineBreak from '../../formats/text-line-break';

const FORMATS = {
  align: AlignClass,
  indent: IndentClass,
  'text-indent': TextIndentClass,
  strike: Strike,
  dotted: DottedClass,
  italic: ItalicClass,
  underline: UnderlineClass,
  script: Script,
  bold: BoldClass,
  image: Image,
  list: List,
  font: FontStyle,
  size: SizeStyle,
  'line-height': LineHeightStyle,
  color: ColorStyle,
  background: BackgroundStyle,
  'paragraph-bottom-space': ParagraphBottomSpaceClass,
};

Object.keys(FORMATS).forEach(item => {
  Quill.register(
    {
      [`formats/${item}`]: FORMATS[item],
    },
    true,
  );
});
